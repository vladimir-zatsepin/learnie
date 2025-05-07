import {
  ChoiceQuizBlock,
  LearningBlockType,
  MaterialBlock,
  MaterialSize,
  MaterialStyle,
  QuizResult,
  Subtopic,
  Subtopics,
  Topic,
  Topics,
  TrueFalseQuizBlock
} from "../models.ts";
import {
  materialSizeDescriptions,
  materialStyleDescriptions,
  learningPlanTypeDescriptions
} from "../LearningStyleDescriptions";
import {ClarificationQuestion, LearnieAgent} from "./LearnieAgent.ts";
import axios, {AxiosError} from "axios";
import {v4 as uuidv4} from 'uuid';
import {LearnieAgentFactory} from "./LearnieAgentFactory.ts";
import {LlmJson} from "./LlmJson.ts";

export class RemoteLearnieAgent implements LearnieAgent {

  private readonly userId: string = "u_123"
  private readonly agentName: string = "tutor_agent"

  private readonly openAiDelegate = LearnieAgentFactory.getAgent('openai')

  async generateClarificationQuestions(prompt: string, previousQA?: ClarificationQuestion[], questionNumber?: number): Promise<ClarificationQuestion[]> {
    return this.openAiDelegate.generateClarificationQuestions(prompt, previousQA, questionNumber);
  }

  async generateTopic(prompt: string, _clarificationAnswers?: ClarificationQuestion[]): Promise<Topic> {
    const sessionId = uuidv4();
    await this.createSessionIfNotExists(sessionId);

    // Get learning plan type from clarification answers if available
    let learningPlanTypeInfo = '';
    if (_clarificationAnswers && _clarificationAnswers.length > 0) {
      const clarificationInfo = `
        Additional clarification information:
        ${_clarificationAnswers.map((qa, index) =>
          `Question ${index + 1}: ${qa.question}
           Answer ${index + 1}: ${qa.answer || 'No answer provided'}`
        ).join('\n')}
      `;
      learningPlanTypeInfo = clarificationInfo;
    }

    const promptRequest = `
      Generate a topic based on the following prompt:
      ${prompt}

      ${learningPlanTypeInfo ? `User's learning style preferences:
      ${learningPlanTypeInfo}

      Use this additional information to better tailor the learning module to the user's needs.` : ''}
    `;

    const topic = await this.request(sessionId, promptRequest) as Topic;

    // Store the clarification answers as a learningStylePrompt
    if (_clarificationAnswers && _clarificationAnswers.length > 0) {
      topic.learningStylePrompt = learningPlanTypeInfo;
    }

    this.setIds(topic, sessionId);
    return topic;
  }

  private setIds(topic: Topic, sessionId: string) {
    topic.id = sessionId;
    for (let sectionIndex = 0; sectionIndex < topic.sections.length; sectionIndex++) {
      const section = topic.sections[sectionIndex];
      section.id = `s${sectionIndex + 1}`;
      for (let subtopicIndex = 0; subtopicIndex < section.subtopics.length; subtopicIndex++) {
        const subtopic = section.subtopics[subtopicIndex];
        subtopic.id = `s${sectionIndex + 1}-t${subtopicIndex + 1}`;
      }
    }
  }

  private async createSessionIfNotExists(sessionId: string) {
    try {
      await axios.post(`/api/apps/${this.agentName}/users/${this.userId}/sessions/${sessionId}`)
    } catch (e) {
      const error = e as AxiosError;
      if (error.status == 400) {
        console.log(`Session ${sessionId} already exists, skipping creation`);
      } else {
        console.error('Error creating session:', e);
        throw e;
      }
    }
  }

  async generateLearningBlock(topic: Topic, subtopicId: string, prompt?: string): Promise<MaterialBlock> {
    //return this.openAiDelegate.generateLearningBlock(topic, subtopicId, prompt);

    await this.createSessionIfNotExists(topic.id);
    const subtopic = Topics.getSubtopicInTopic(topic, subtopicId);
    const summary = Subtopics.summarizeLearningBlocks(subtopic);

    // Get descriptions for the current learning style
    const materialSizeDesc = topic.learningStyle?.materialSize ?
      materialSizeDescriptions[topic.learningStyle.materialSize] : "";
    const materialStyleDesc = topic.learningStyle?.materialStyle ?
      materialStyleDescriptions[topic.learningStyle.materialStyle] : "";

    // Use custom prompt for learning plan type if provided, otherwise use default description
    const learningPlanTypeDesc = topic.learningPlanTypePrompt ?
      topic.learningPlanTypePrompt :
      (topic.learningPlanType ? learningPlanTypeDescriptions[topic.learningPlanType] : "");

    const requestPrompt = `
      Generate learning material for subtopic:
        - topic title: ${topic.title}
        - subtopic title: ${subtopic.title}
        - summary: ${subtopic.summary}
        - user's prompt: ${prompt}

      Use the following learning style preferences:
        - Material style: ${topic.learningStyle?.materialStyle} (${materialStyleDesc})
        - Material size: ${topic.learningStyle?.materialSize} (${materialSizeDesc})
        - Learning plan type: ${topic.learningPlanType} (${learningPlanTypeDesc})

      Already learnt material:
        ${summary}
    `
    const block = await this.request(topic.id, requestPrompt) as MaterialBlock;
    block.type = LearningBlockType.MATERIAL
    return block;
  }

  generateTrueFalseQuiz(topic: Topic, subtopicId: string): Promise<TrueFalseQuizBlock> {
    return this.openAiDelegate.generateTrueFalseQuiz(topic, subtopicId);
  }

  generateChoiceQuiz(topic: Topic, subtopicId: string): Promise<ChoiceQuizBlock> {
    return this.openAiDelegate.generateChoiceQuiz(topic, subtopicId);
  }

  generateSubtopic(topic: Topic, parentSubtopicId: string, generalContext?: string): Promise<Subtopic> {
    return this.openAiDelegate.generateSubtopic(topic, parentSubtopicId, generalContext);
  }

  generateSubtopicSuggestions(topic: Topic, parentSubtopicId: string): Promise<Subtopic> {
    return this.openAiDelegate.generateSubtopicSuggestions(topic, parentSubtopicId);
  }

  async sendQuizResultsAndGetSubtopicScore(topicId: string, quizResult: QuizResult): Promise<number> {
    try {
      // Format questions for the prompt
      const questionsFormatted = quizResult.questions.map(q => {
        return `
          Question: ${q.question}
          - User answer: ${q.userAnswer}
          - Correct answer: ${q.correctAnswer}
          Is correct: ${q.isCorrect}
          ---
        `;
      }).join('\n');

      const requestPrompt = `
        Here is the quiz results subtopic title: ${quizResult.subtopicTitle}:
          - PASSED: ${quizResult.passed}
          - questions and results: ${questionsFormatted}

        How good I know this subtopic now? Evaluate all my quizes regarding this subtopic and reutrn me the score of how much of this subtopic material I've learnt where 100 means 'I fully know the subtopic'
        You output is a single valid JSON without any other characters around the JSON. Example output: {"score": 70}
      `;

      const response = await this.request(topicId, requestPrompt);
      console.log('Quiz results sent to agent:', quizResult);

      // Parse the score from the response
      const scoreData = response as { score: number };
      return scoreData.score;
    } catch (error) {
      console.error('Error sending quiz results to agent:', error);
      return 0; // Return a default value when error occurs
    }
  }

  private async request(sessionId: string, prompt: string): Promise<unknown> {
    console.log('Requesting:', prompt);
    const response = await axios.post('/api/run', {
      app_name: this.agentName,
      user_id: this.userId,
      session_id: sessionId,
      new_message: {
        role: 'user',
        parts: [
          {
            text: prompt
          }
        ]
      }
    });
    const data = response.data;
    console.log('Response:', data);
    const lastPart = data[data.length - 1].content.parts[0].text;
    return LlmJson.parse(lastPart);
  }
}
