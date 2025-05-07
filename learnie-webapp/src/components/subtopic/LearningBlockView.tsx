import React from 'react';
import {
  LearningBlock,
  LearningBlockType,
  MaterialBlock,
  TrueFalseQuizBlock,
  ChoiceQuizBlock,
  QuizResult,
  QuizQuestionResult
} from "../../services/models";
import TrueFalseQuizView from './TrueFalseQuizView.tsx';
import ChoiceQuizView from './ChoiceQuizView.tsx';
import MaterialBlockView from './MaterialBlockView';
import {useLearning} from "../../hooks/useLearning";
import {LearnieAgentFactory} from "../../services/ai";

interface LearningBlockProps {
  block: LearningBlock;
  onDelete?: (block: LearningBlock) => void;
  subtopicId?: string;
}

/**
 * Component for displaying a single learning block
 */
const LearningBlockView: React.FC<LearningBlockProps> = ({block, onDelete, subtopicId}) => {
  const {currentTopic, updateSubtopic} = useLearning();

  // Handle quiz completion
  const handleQuizComplete = (passed: boolean) => {
    if (!currentTopic || !subtopicId) return;

    // Get the subtopic
    const subtopic = currentTopic.sections.flatMap(section => section.subtopics)
      .find(s => s.id === subtopicId);

    if (!subtopic) {
      console.error(`Subtopic with ID ${subtopicId} not found`);
      return;
    }

    // Find the block in the subtopic's learning blocks
    const updatedLearningBlocks = subtopic.learningBlocks?.map(b => {
      if (b === block) {
        // Ensure the passed property is set on the block
        if (b.type === LearningBlockType.QUIZ_TRUE_FALSE) {
          return { ...b, passed } as TrueFalseQuizBlock;
        } else if (b.type === LearningBlockType.QUIZ_CHOICE) {
          return { ...b, passed } as ChoiceQuizBlock;
        }
      }
      return b;
    });

    // Update the subtopic with the modified block
    const updatedSubtopic = {
      ...subtopic,
      learningBlocks: updatedLearningBlocks
    };

    // Update the subtopic in the topic tree
    updateSubtopic(currentTopic.id, updatedSubtopic);

    // Create a QuizResult object
    if (block.type === LearningBlockType.QUIZ_TRUE_FALSE || block.type === LearningBlockType.QUIZ_CHOICE) {
      const questions: QuizQuestionResult[] = [];

      if (block.type === LearningBlockType.QUIZ_TRUE_FALSE) {
        const tfBlock = block as TrueFalseQuizBlock;
        tfBlock.questions.forEach((q) => {
          // In a real implementation, we would get the user's answers from state
          // For now, we'll assume the user answered correctly if the quiz was passed
          const isCorrect = passed; // This is a simplification
          questions.push({
            question: q.question,
            userAnswer: isCorrect ? String(q.correctAnswer) : String(!q.correctAnswer),
            correctAnswer: String(q.correctAnswer),
            isCorrect: isCorrect
          });
        });
      } else if (block.type === LearningBlockType.QUIZ_CHOICE) {
        const choiceBlock = block as ChoiceQuizBlock;
        choiceBlock.questions.forEach((q) => {
          // In a real implementation, we would get the user's answers from state
          // For now, we'll assume the user answered correctly if the quiz was passed
          const isCorrect = passed; // This is a simplification
          questions.push({
            question: q.question,
            userAnswer: q.options[isCorrect ? q.correctOptionIndex : (q.correctOptionIndex + 1) % q.options.length],
            correctAnswer: q.options[q.correctOptionIndex],
            isCorrect: isCorrect
          });
        });
      }

      const quizResult: QuizResult = {
        subtopicId: subtopicId,
        subtopicTitle: subtopic.title,
        quizType: block.type as LearningBlockType.QUIZ_TRUE_FALSE | LearningBlockType.QUIZ_CHOICE,
        questions: questions,
        passed: passed
      };

      // Get the AI provider and send the quiz results
      const aiProvider = LearnieAgentFactory.getAgent();
      aiProvider.sendQuizResultsAndGetSubtopicScore(currentTopic.id, quizResult)
        .then(score => {
          // Update the subtopic with the progress score
          const updatedSubtopicWithProgress = {
            ...updatedSubtopic,
            progress: score
          };

          // Update the subtopic in the topic tree with the progress score
          updateSubtopic(currentTopic.id, updatedSubtopicWithProgress);

          console.log(`Updated subtopic ${subtopicId} with progress score: ${score}`);
        })
        .catch(error => console.error('Error sending quiz results:', error));
    }
  };

  // Render true/false quiz block
  if (block.type === LearningBlockType.QUIZ_TRUE_FALSE) {
    const quizBlock = block as TrueFalseQuizBlock;
    return <TrueFalseQuizView
      block={quizBlock}
      onDelete={onDelete ? (b) => onDelete(b) : undefined}
      onQuizComplete={handleQuizComplete}
    />;
  }

  // Render choice quiz block
  if (block.type === LearningBlockType.QUIZ_CHOICE) {
    const choiceQuizBlock = block as ChoiceQuizBlock;
    return <ChoiceQuizView
      block={choiceQuizBlock}
      onDelete={onDelete ? (b) => onDelete(b) : undefined}
      onQuizComplete={handleQuizComplete}
    />;
  }

  // Render regular material block
  const materialBlock = block as MaterialBlock;
  return <MaterialBlockView block={materialBlock} onDelete={onDelete ? (b) => onDelete(b) : undefined}/>;
};

export default LearningBlockView;
