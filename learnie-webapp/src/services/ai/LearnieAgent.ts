import {
  MaterialBlock,
  TrueFalseQuizBlock,
  ChoiceQuizBlock,
  Subtopic,
  Topic,
  QuizResult,
  LearningPlanStyle,
  GameBlock
} from "../models.ts";

/**
 * Interface for clarification questions
 */
export interface ClarificationQuestion {
  question: string;
  answer?: string;
}

/**
 * Interface for AI providers (OpenAI, Gemini, etc.)
 * This allows us to easily switch between different AI providers
 */
export interface LearnieAgent {

  generateClarificationQuestions(
    prompt: string,
    previousQA?: ClarificationQuestion[],
    questionNumber?: number
  ): Promise<ClarificationQuestion[]>;

  generateTopic(userInput: string, learningPlanStyle: LearningPlanStyle): Promise<Topic>;

  generateLearningBlock(topic: Topic, subtopicId: string, prompt?: string): Promise<MaterialBlock>;

  generateTrueFalseQuiz(topic: Topic, subtopicId: string): Promise<TrueFalseQuizBlock>;

  generateChoiceQuiz(topic: Topic, subtopicId: string): Promise<ChoiceQuizBlock>;

  generateSubtopic(topic: Topic, parentSubtopicId: string, generalContext?: string): Promise<Subtopic>;

  generateSubtopicSuggestions(topic: Topic, parentSubtopicId: string): Promise<Subtopic>

  sendQuizResultsAndGetSubtopicScore(topicId: string, quizResult: QuizResult): Promise<number>

  /**
   * Generate an HTML game based on the subtopic title, user's prompt, learning plan type, and already learnt material
   * @param topic The topic containing the subtopic
   * @param subtopicId The ID of the subtopic
   * @returns Promise with the generated HTML game as a GameBlock
   */
  generateHtmlGame(topic: Topic, subtopicId: string): Promise<GameBlock>;
}
