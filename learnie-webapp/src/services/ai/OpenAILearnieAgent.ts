import OpenAI from 'openai';
import {ClarificationQuestion, LearnieAgent} from './LearnieAgent.ts';
import {
  ChoiceQuizBlock,
  LearningBlockType,
  LearningPlanStyle,
  MaterialBlock,
  Subtopic,
  Subtopics,
  Topic,
  Topics,
  TrueFalseQuizBlock,
  QuizResult,
  GameBlock
} from "../models.ts";
import {
  materialSizeDescriptions,
  materialStyleDescriptions,
  quizDifficultyDescriptions,
  quizSizeDescriptions
} from "../LearningStyleDescriptions";
import {
  generateChoiceQuizPrompt,
  generateClarificationQuestionsPrompt,
  generateLearningBlockPrompt,
  generateSubtopicPrompt,
  generateSubtopicSuggestionsPrompt,
  generateTopicPrompt,
  generateTrueFalseQuizPrompt
} from './Prompts.ts';
import {LlmJson} from "./LlmJson.ts";
import ChatModel = OpenAI.ChatModel;

const DEFAULT_MODEL: ChatModel = 'gpt-4o';
const MAX_TOKENS = 10000;
const TEMPERATURE = 0.7;

/**
 * OpenAI implementation of the AI provider interface
 */
export class OpenAILearnieAgent implements LearnieAgent {

  private client: OpenAI;
  private model: ChatModel;

  constructor(apiKey: string, model: ChatModel = DEFAULT_MODEL) {
    // Ensure the API key is properly formatted
    if (!apiKey || !apiKey.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format');
    }

    this.model = model;
    this.client = new OpenAI({
      apiKey,
      // Allow API calls from the browser environment
      dangerouslyAllowBrowser: true,
    });
  }

  generateHtmlGame(): Promise<GameBlock> {
        throw new Error('Method not implemented.');
    }

  async generateClarificationQuestions(
    prompt: string,
    previousQA?: ClarificationQuestion[],
    questionNumber?: number
  ): Promise<ClarificationQuestion[]> {
    try {
      // Default to generating all 3 questions if no question number is specified
      const isGeneratingSingleQuestion = questionNumber !== undefined;

      // Build context from previous Q&A if available
      let previousQAContext = '';
      if (previousQA && previousQA.length > 0) {
        previousQAContext = `
        Previous questions and answers:
        ${previousQA.map((qa, index) =>
          `Question ${index + 1}: ${qa.question}
           Answer ${index + 1}: ${qa.answer || 'No answer provided'}`
        ).join('\n')}

        Based on these previous questions and answers, ${isGeneratingSingleQuestion ? 'generate the next follow-up question' : 'generate 3 clarification questions'}.
        `;
      }

      // Use the prompt function from Prompts.ts
      const fullPrompt = generateClarificationQuestionsPrompt(
        prompt,
        previousQAContext,
        questionNumber
      );

      const content = await this.jsonCompletion(fullPrompt);
      return content as ClarificationQuestion[];
    } catch (error) {
      console.error('Error generating clarification questions with OpenAI:', error);
      throw new Error('Failed to generate clarification questions with OpenAI');
    }
  }

  async generateTopic(userInput: string, learningPlanStyle: LearningPlanStyle): Promise<Topic> {
    try {
      // Create clarification info based on learning plan style
      const clarificationInfo = `
        Use the following learning plan style:
        ${Topics.learningPlanStyleSummary(learningPlanStyle)}
      `;

      // Use the prompt function from Prompts.ts
      const fullPrompt = generateTopicPrompt(userInput, clarificationInfo);

      const content = await this.jsonCompletion(fullPrompt);
      const topic = content as Topic;

      // Set the learning plan style in the topic
      topic.learningPlanStyle = learningPlanStyle;

      return topic;
    } catch (error) {
      console.error('Error generating topic with OpenAI:', error);
      throw new Error('Failed to generate topic with OpenAI');
    }
  }


  async generateLearningBlock(topic: Topic, subtopicId: string, prompt?: string): Promise<MaterialBlock> {
    try {
      const subtopic = Topics.getSubtopicInTopic(topic, subtopicId);
      const subtopicSummary = Subtopics.summarizeLearningBlocks(subtopic);

      // Use structured learning style if available, otherwise fall back to legacy prompt
      let userLearningStyle = '';

      if (topic.learningStyle) {

        // Format the structured learning style settings with descriptions
        userLearningStyle = `
        Learning Style Preferences:
        - Material size: ${topic.learningStyle.materialSize} (${materialSizeDescriptions[topic.learningStyle.materialSize]})
        - Material style: ${topic.learningStyle.materialStyle} (${materialStyleDescriptions[topic.learningStyle.materialStyle]})
        - Quiz difficulty: ${topic.learningStyle.quizDifficulty} (${quizDifficultyDescriptions[topic.learningStyle.quizDifficulty]})
        - Quiz size: ${topic.learningStyle.quizSize} (${quizSizeDescriptions[topic.learningStyle.quizSize]})
        - Learning plan style: ${Topics.learningPlanStyleSummary(topic.learningPlanStyle)}
        `.trim();
      }

      // Use the prompt function from Prompts.ts with additional learning style info
      const fullPrompt = generateLearningBlockPrompt(
        topic,
        subtopic,
        subtopicSummary,
        prompt,
        userLearningStyle // Pass the learning style prompt
      );

      const content = await this.jsonCompletion(fullPrompt);
      const materialBlock = content as MaterialBlock;

      // Ensure the type field is set to MATERIAL
      if (!materialBlock.type) {
        materialBlock.type = LearningBlockType.MATERIAL;
      }

      return materialBlock;
    } catch (error) {
      console.error('Error generating learning block with OpenAI:', error);
      throw new Error('Failed to generate learning block with OpenAI');
    }
  }

  async generateTrueFalseQuiz(topic: Topic, subtopicId: string): Promise<TrueFalseQuizBlock> {
    try {
      const subtopic = Topics.getSubtopicInTopic(topic, subtopicId);
      const subtopicSummary = Subtopics.summarizeLearningBlocks(subtopic);

      // Use structured learning style if available, otherwise fall back to legacy prompt
      let userLearningStyle = '';

      if (topic.learningStyle) {
        // Format the structured learning style settings with descriptions
        userLearningStyle = `
          Learning Style Preferences:
          - Material size: ${topic.learningStyle.materialSize} (${materialSizeDescriptions[topic.learningStyle.materialSize]})
          - Material style: ${topic.learningStyle.materialStyle} (${materialStyleDescriptions[topic.learningStyle.materialStyle]})
          - Quiz difficulty: ${topic.learningStyle.quizDifficulty} (${quizDifficultyDescriptions[topic.learningStyle.quizDifficulty]})
          - Quiz size: ${topic.learningStyle.quizSize} (${quizSizeDescriptions[topic.learningStyle.quizSize]})
          - Learning plan style: ${Topics.learningPlanStyleSummary(topic.learningPlanStyle)}
        `.trim();
      }

      // Use the prompt function from Prompts.ts with additional learning style info
      const fullPrompt = generateTrueFalseQuizPrompt(
        {title: subtopic.title, id: subtopic.id},
        subtopicSummary,
        userLearningStyle // Pass the learning style prompt
      );

      const quizBlock = await this.jsonCompletion(fullPrompt) as TrueFalseQuizBlock;
      quizBlock.type = LearningBlockType.QUIZ_TRUE_FALSE;

      return quizBlock;
    } catch (error) {
      console.error('Error generating quiz with OpenAI:', error);
      throw new Error('Failed to generate quiz with OpenAI');
    }
  }

  async generateChoiceQuiz(topic: Topic, subtopicId: string): Promise<ChoiceQuizBlock> {
    try {
      const subtopic = Topics.getSubtopicInTopic(topic, subtopicId);
      const subtopicSummary = Subtopics.summarizeLearningBlocks(subtopic);

      // Use structured learning style if available, otherwise fall back to legacy prompt
      let userLearningStyle = '';

      if (topic.learningStyle) {
        // Format the structured learning style settings with descriptions
        userLearningStyle = `
          Learning Style Preferences:
          - Material size: ${topic.learningStyle.materialSize} (${materialSizeDescriptions[topic.learningStyle.materialSize]})
          - Material style: ${topic.learningStyle.materialStyle} (${materialStyleDescriptions[topic.learningStyle.materialStyle]})
          - Quiz difficulty: ${topic.learningStyle.quizDifficulty} (${quizDifficultyDescriptions[topic.learningStyle.quizDifficulty]})
          - Quiz size: ${topic.learningStyle.quizSize} (${quizSizeDescriptions[topic.learningStyle.quizSize]})
          - Learning plan style: ${Topics.learningPlanStyleSummary(topic.learningPlanStyle)}
        `.trim();
      }

      // Use the prompt function from Prompts.ts with additional learning style info
      const fullPrompt = generateChoiceQuizPrompt(
        {title: subtopic.title, id: subtopic.id},
        subtopicSummary,
        userLearningStyle // Pass the learning style prompt
      );

      const quizBlock = await this.jsonCompletion(fullPrompt) as ChoiceQuizBlock
      quizBlock.type = LearningBlockType.QUIZ_CHOICE;

      return quizBlock;
    } catch (error) {
      console.error('Error generating choice quiz with OpenAI:', error);
      throw new Error('Failed to generate choice quiz with OpenAI');
    }
  }

  async generateSubtopic(topic: Topic, parentSubtopicId: string, customPrompt?: string): Promise<Subtopic> {
    try {
      // Format the entire topic structure for context
      const formattedTopicStructure = this.formatTopicStructure(topic);

      const parentSubtopic = Topics.getSubtopicInTopic(topic, parentSubtopicId);

      // Get all existing subtopic titles from the entire topic to avoid repetition
      const siblingSubtopics = [""]

      // Use the prompt function from Prompts.ts
      const fullPrompt = generateSubtopicPrompt(
        topic,
        formattedTopicStructure,
        parentSubtopic,
        siblingSubtopics,
        customPrompt,
      );

      const content = await this.jsonCompletion(fullPrompt);
      return content as Subtopic;
    } catch (error) {
      console.error('Error generating subtopic with OpenAI:', error);
      throw new Error('Failed to generate subtopic with OpenAI');
    }
  }

  private formatTopicStructure(topic: Topic): string {
    let result = `Topic: ${topic.title} (Subject: ${topic.subject})\n\n`;

    // Format each section and its subtopics
    topic.sections.forEach((section, sectionIndex) => {
      result += `Section ${sectionIndex + 1}: ${section.title}\n`;

      // Format each subtopic in the section
      section.subtopics.forEach((subtopic, subtopicIndex) => {
        result += this.formatSubtopic(subtopic, 1, `${sectionIndex + 1}.${subtopicIndex + 1}`);
      });

      result += '\n';
    });

    return result;
  }

  private formatSubtopic(subtopic: Subtopic, depth: number = 0, prefix: string = ''): string {
    // Format the current subtopic with indentation based on depth
    let result = `${' '.repeat(depth * 2)}- ${prefix} ${subtopic.title} (ID: ${subtopic.id})`;

    // Add summary if available
    if (subtopic.summary) {
      result += `: ${subtopic.summary}`;
    }

    result += '\n';

    return result;
  }


  async generateSubtopicSuggestions(topic: Topic, parentSubtopicId: string): Promise<Subtopic> {
    try {
      // Format the entire topic structure for context
      const formattedTopicStructure = this.formatTopicStructure(topic);

      const parentSubtopic = Topics.getSubtopicInTopic(topic, parentSubtopicId);

      // Get all existing subtopic titles from the entire topic to avoid repetition
      const siblingSubtopics = [""]

      // Use the prompt function from Prompts.ts
      const fullPrompt = generateSubtopicSuggestionsPrompt(
        topic,
        formattedTopicStructure,
        parentSubtopic,
        siblingSubtopics
      );

      const content = await this.jsonCompletion(fullPrompt);
      return content as Subtopic;
    } catch (error) {
      console.error('Error generating subtopic suggestions with OpenAI:', error);
      throw new Error('Failed to generate subtopic suggestions with OpenAI');
    }
  }

  private async jsonCompletion(prompt: string): Promise<unknown> {
    console.log('Prompt to OpenAI:', prompt);
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }
    const json = LlmJson.parse(content);
    console.log('Response from OpenAI:', json);
    return json;
  }

  async sendQuizResultsAndGetSubtopicScore(topicId: string, quizResult: QuizResult): Promise<number> {
    console.log(topicId);
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

        How good I know this subtopic now? Evaluate all my quizes regarding this subtopic and return me the score of how much of this subtopic material I've learnt where 100 means 'I fully know the subtopic'
        You output is a single valid JSON without any other characters around the JSON. Example output: {"score": 70}
      `;

      const response = await this.jsonCompletion(requestPrompt);
      console.log('Quiz results sent to OpenAI:', quizResult);

      // Parse the score from the response
      const scoreData = response as { score: number };
      return scoreData.score;
    } catch (error) {
      console.error('Error sending quiz results to OpenAI:', error);
      return 0; // Return a default value when error occurs
    }
  }
}
