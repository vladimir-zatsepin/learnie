export enum MaterialSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export enum MaterialStyle {
  STORYTELLING = 'story-telling',
  BULLETIN_POINTS = 'bulletin points'
}

export enum QuizDifficulty {
  BASIC = 'basic',
  MEDIUM = 'medium',
  ADVANCED = 'advanced'
}

export enum QuizSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export enum LearningPlanType {
  EXPLORER = 'explorer',
  ACHIEVER = 'achiever',
  SOCIAL_LEARNER = 'social_learner'
}

export interface LearningStyle {
  materialSize: MaterialSize;
  materialStyle: MaterialStyle;
  quizDifficulty: QuizDifficulty;
  quizSize: QuizSize;
}

export interface Topic {
  id: string;
  title: string;
  subject: string;
  sections: Section[];
  learningStyle?: LearningStyle;
  learningPlanStyle?: LearningPlanStyle;
}

export interface LearningPlanStyle {
  learningPlanType?: LearningPlanType;
  learningPlanTypePrompt?: string;
}

export interface Section {
  id: string;
  title: string
  subtopics: Subtopic[];
  imageUrl?: string;
}

export interface Subtopic {
  id: string;
  title: string;
  summary?: string; // Short summary up to 144 characters (used only for prompts, not visible to users)
  order: number; // Represents the order in which material should be learned on the same level
  // Blocks are lazy generated
  learningBlocks?: LearningBlock[];
  progress?: number; // Progress score from 0 to 100
}

export enum LearningBlockType {
  MATERIAL = 'MATERIAL',
  QUIZ_TRUE_FALSE = 'QUIZ_TRUE_FALSE',
  QUIZ_CHOICE = 'QUIZ_CHOICE'
}

export interface LearningBlock {
  type?: LearningBlockType;
}

export interface MaterialBlock extends LearningBlock {
  type: LearningBlockType.MATERIAL;
  title: string;
  material: string | MaterialPart[];
  summary?: string; // Short summary up to 255 words
  references?: Reference[]; // External resources references
}

export interface MaterialPart {
  text: string;
  imageUrl: string;
  imageDescription: string;
}

export interface Reference {
  title: string;
  url: string;
}

export interface QuizBlock extends LearningBlock {
  title: string;
}

export interface TrueFalseQuizBlock extends QuizBlock {
  type: LearningBlockType.QUIZ_TRUE_FALSE;
  questions: TrueFalseQuizQuestion[];
  passed?: boolean; // Indicates if the quiz has been passed
}

export interface ChoiceQuizBlock extends QuizBlock {
  type: LearningBlockType.QUIZ_CHOICE;
  questions: ChoiceQuizQuestion[];
  passed?: boolean; // Indicates if the quiz has been passed
}

export interface TrueFalseQuizQuestion {
  question: string;
  correctAnswer: boolean;
  explanation?: string; // Explanation of the answer (up to 144 characters)
}

export interface ChoiceQuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string; // Explanation of the answer (up to 144 characters)
}

export interface QuizResult {
  subtopicId: string;
  subtopicTitle: string;
  quizType: LearningBlockType.QUIZ_TRUE_FALSE | LearningBlockType.QUIZ_CHOICE;
  questions: QuizQuestionResult[];
  passed: boolean;
}

export interface QuizQuestionResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export class Topics {

  static getSubtopicInTopic(topic: Topic, subtopicId: string): Subtopic {
    // Iterate through all sections and their subtopics
    for (const section of topic.sections) {
      for (const subtopic of section.subtopics) {
        if (subtopic.id == subtopicId) {
          return subtopic;
        }
      }
    }
    throw new Error(`Subtopic with ID ${subtopicId} not found in any section`);
  }

  static getSectionForSubtopic(topic: Topic, subtopicId: string): Section {
    for (const section of topic.sections) {
      // Check if the subtopic is in this section
      if (section.subtopics.some(subtopic => subtopic.id === subtopicId)) {
        return section;
      }
    }
    throw new Error(`Subtopic with ID ${subtopicId} not found in topic ${topic.id}`);
  }

  static learningPlanStyleSummaryForTopic(topic: Topic): string {
    const learningPlanStyle = topic.learningPlanStyle;
    return this.learningPlanStyleSummary(learningPlanStyle);
  }

  static learningPlanStyleSummary(learningPlanStyle?: LearningPlanStyle): string {
    if (learningPlanStyle?.learningPlanTypePrompt) {
      return learningPlanStyle.learningPlanTypePrompt;
    } else if (learningPlanStyle?.learningPlanType) {
      // Return a basic description based on the learning plan type
      switch (learningPlanStyle.learningPlanType) {
        case LearningPlanType.EXPLORER:
          return "A flexible, discovery-based learning approach that adapts to your interests and helps you explore new topics organically.";
        case LearningPlanType.ACHIEVER:
          return "A goal-oriented, structured approach with clear milestones and measurable outcomes to efficiently reach specific learning objectives.";
        case LearningPlanType.SOCIAL_LEARNER:
          return "A collaborative learning experience that leverages community interaction, peer feedback, and group dynamics to enhance understanding and motivation.";
        default:
          return "";
      }
    } else {
      return "No specific learning plan style selected";
    }
  }
}


export class Subtopics {

  static summarizeLearningBlocks(subtopic: Subtopic): string {
    let summary = "";
    if (subtopic.learningBlocks && subtopic.learningBlocks.length > 0) {
      summary = "Existing Learning Blocks:\n";
      subtopic.learningBlocks
        .filter(block => block.type === LearningBlockType.MATERIAL)
        .map(block => block as MaterialBlock)
        .forEach((block, index) => {
          let material = ''
          if (Array.isArray(block.material)) {
            material = block.material.map(part => part.text).join('\n');
          } else {
            material = block.material;
          }
          summary += `Block ${index + 1}: ${block.title}\n${material}\n\n`;
        });
    }
    return summary;
  }
}
