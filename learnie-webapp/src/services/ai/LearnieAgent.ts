import {
  MaterialBlock,
  TrueFalseQuizBlock,
  ChoiceQuizBlock,
  Subtopic,
  Topic,
  QuizResult,
  LearningPlanStyle
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
}
