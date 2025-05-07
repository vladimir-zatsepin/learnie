import {MaterialSize, MaterialStyle, QuizDifficulty, QuizSize, LearningPlanType} from "./models";

// Material size descriptions
export const materialSizeDescriptions: Record<MaterialSize, string> = {
  [MaterialSize.SMALL]: "Concise content with essential information. 1 min reading time",
  [MaterialSize.MEDIUM]: "Balanced content with good detail. 5 mins reading time.",
  [MaterialSize.LARGE]: "Comprehensive content with in-depth explanations. 10 mins reading time."
};

// Material style descriptions
export const materialStyleDescriptions: Record<MaterialStyle, string> = {
  [MaterialStyle.STORYTELLING]: "Narrative approach with flowing explanations",
  [MaterialStyle.BULLETIN_POINTS]: "Structured list format for easy scanning and markdown formatting"
};

// Quiz difficulty descriptions
export const quizDifficultyDescriptions: Record<QuizDifficulty, string> = {
  [QuizDifficulty.BASIC]: "Fundamental concepts for beginners",
  [QuizDifficulty.MEDIUM]: "Balanced complexity for intermediate learners",
  [QuizDifficulty.ADVANCED]: "Challenging questions requiring deeper understanding"
};

// Quiz size descriptions
export const quizSizeDescriptions: Record<QuizSize, string> = {
  [QuizSize.SMALL]: "Fewer questions for quick assessment",
  [QuizSize.MEDIUM]: "Balanced set of questions",
  [QuizSize.LARGE]: "Comprehensive testing with many questions"
};

// Learning plan type descriptions
export const learningPlanTypeDescriptions: Record<LearningPlanType, string> = {
  [LearningPlanType.EXPLORER]: "A flexible, discovery-based learning approach that adapts to your interests and helps you explore new topics organically.",
  [LearningPlanType.ACHIEVER]: "A goal-oriented, structured approach with clear milestones and measurable outcomes to efficiently reach specific learning objectives.",
  [LearningPlanType.SOCIAL_LEARNER]: "A collaborative learning experience that leverages community interaction, peer feedback, and group dynamics to enhance understanding and motivation."
};
