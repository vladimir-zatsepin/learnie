import React, {useEffect, useState, useCallback} from 'react';
import {
  Box,
  Flex,
  Button,
} from '@chakra-ui/react';
import {useParams, useNavigate} from 'react-router-dom';
import SubtopicView from '../components/subtopic/SubtopicView';
import {Subtopic, MaterialBlock, Topic, Section, Topics} from '../services/models';
import {LearnieAgentFactory} from '../services/ai';
import {useLearning} from "../hooks/useLearning";

const SubtopicPage: React.FC = () => {
  const {topicId, subtopicId} = useParams<{ topicId: string, subtopicId: string }>();
  const navigate = useNavigate();

  const [isGeneratingBlock, setIsGeneratingBlock] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isGeneratingChoiceQuiz, setIsGeneratingChoiceQuiz] = useState(false);
  const [section, setSection] = useState<Section | null>(null);
  const [subtopic, setSubtopic] = useState<Subtopic | null>(null);

  const {
    setCurrentTopic,
    currentTopic,
    updateSubtopic
  } = useLearning();

  // Function to flatten the topic structure
  const flattenTopicDFS = useCallback((topic: Topic, result: Subtopic[] = []): Subtopic[] => {
    // In the new model, subtopics don't have children, so we just need to collect all subtopics from all sections
    if (topic.sections && Array.isArray(topic.sections)) {
      for (const section of topic.sections) {
        if (section.subtopics && Array.isArray(section.subtopics)) {
          // Add all subtopics from this section to the result
          result.push(...section.subtopics);
        }
      }
    }

    return result;
  }, []);

  // Function to get the previous and next nodes in DFS order
  const getDFSNavigation = useCallback((topic: Topic, nodeId: string): {
    previous: Subtopic | null,
    next: Subtopic | null
  } => {
    // Flatten the topic structure in DFS order
    const flatSubtopics = flattenTopicDFS(topic);

    // Find the index of the current node
    const currentIndex = flatSubtopics.findIndex(node => node.id === nodeId);

    // If the node is not found, return null for both previous and next
    if (currentIndex === -1) {
      return {previous: null, next: null};
    }

    // Get the previous and next nodes
    const previous = currentIndex > 0 ? flatSubtopics[currentIndex - 1] : null;
    const next = currentIndex < flatSubtopics.length - 1 ? flatSubtopics[currentIndex + 1] : null;

    return {previous, next};
  }, [flattenTopicDFS]);

  useEffect(() => {
    if (topicId) {
      setCurrentTopic(topicId);
    }
  }, [topicId, setCurrentTopic]);

  useEffect(() => {
    if (!currentTopic || !subtopicId) {
      return
    }
    const subtopic = Topics.getSubtopicInTopic(currentTopic, subtopicId);
    const section = Topics.getSectionForSubtopic(currentTopic, subtopic.id);
    setSection(section);
    setSubtopic(subtopic);
  }, [currentTopic, subtopicId, setSection, setSubtopic]);

  const handleBack = () => {
    navigate(`/topics/${topicId}`);
  };

  const handleNavigateToSubtopic = (nodeId: string) => {
    // Extract the actual node ID if it has the "node-" prefix
    const actualNodeId = nodeId.startsWith('node-') ? nodeId.substring(5) : nodeId;
    navigate(`/topics/${topicId}/subtopics/${actualNodeId}`);
  };

  // Handle generating a learning block for a subtopic
  const handleGenerateLearningBlock = useCallback(async (subtopicId: string, prompt?: string) => {
    if (!currentTopic) return;

    try {
      setIsGeneratingBlock(true);

      // Get the AI provider from the factory
      const aiProvider = LearnieAgentFactory.getAgent();

      // Generate the learning block
      const learningBlock: MaterialBlock = await aiProvider.generateLearningBlock(currentTopic, subtopicId, prompt);

      // Get the subtopic
      const subtopic = Topics.getSubtopicInTopic(currentTopic, subtopicId);
      if (!subtopic) {
        throw new Error(`Subtopic with ID ${subtopicId} not found`);
      }

      // Update the subtopic with the new learning block
      const updatedSubtopic = {
        ...subtopic,
        learningBlocks: [...(subtopic.learningBlocks || []), learningBlock]
      };

      // Update the subtopic in the topic tree
      updateSubtopic(currentTopic.id, updatedSubtopic);

      // Update the selected node
      setSubtopic(updatedSubtopic);
    } catch (error) {
      console.error('Error generating learning block:', error);
    } finally {
      setIsGeneratingBlock(false);
    }
  }, [currentTopic, updateSubtopic]);

  // Handle generating a true/false quiz for a subtopic
  const handleGenerateQuiz = useCallback(async (subtopicId: string) => {
    if (!currentTopic) return;

    try {
      setIsGeneratingQuiz(true);

      // Get the AI provider from the factory
      const aiProvider = LearnieAgentFactory.getAgent();

      // Generate the quiz
      const quizBlock = await aiProvider.generateTrueFalseQuiz(currentTopic, subtopicId);

      // Get the subtopic
      const subtopic = Topics.getSubtopicInTopic(currentTopic, subtopicId);

      // Update the subtopic with the new quiz block
      const updatedSubtopic = {
        ...subtopic,
        learningBlocks: [...(subtopic.learningBlocks || []), quizBlock]
      };

      // Update the subtopic in the topic tree
      updateSubtopic(currentTopic.id, updatedSubtopic);

      // Update the selected node
      setSubtopic(updatedSubtopic);
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsGeneratingQuiz(false);
    }
  }, [currentTopic, updateSubtopic]);

  // Handle generating a choice quiz for a subtopic
  const handleGenerateChoiceQuiz = useCallback(async (subtopicId: string) => {
    if (!currentTopic) return;

    try {
      setIsGeneratingChoiceQuiz(true);

      // Get the AI provider from the factory
      const aiProvider = LearnieAgentFactory.getAgent();

      // Generate the choice quiz
      const quizBlock = await aiProvider.generateChoiceQuiz(currentTopic, subtopicId);

      // Get the subtopic
      const subtopic = Topics.getSubtopicInTopic(currentTopic, subtopicId);

      // Update the subtopic with the new quiz block
      const updatedSubtopic = {
        ...subtopic,
        learningBlocks: [...(subtopic.learningBlocks || []), quizBlock]
      };

      // Update the subtopic in the topic tree
      updateSubtopic(currentTopic.id, updatedSubtopic);

      // Update the selected node
      setSubtopic(updatedSubtopic);
    } catch (error) {
      console.error('Error generating choice quiz:', error);
    } finally {
      setIsGeneratingChoiceQuiz(false);
    }
  }, [currentTopic, updateSubtopic]);

  // Handle deleting a learning block from a subtopic
  const handleDeleteBlock = useCallback((subtopicId: string, blockIndex: number) => {
    if (!currentTopic) return;

    try {
      // Get the subtopic
      const subtopic = Topics.getSubtopicInTopic(currentTopic, subtopicId);
      if (!subtopic || !subtopic.learningBlocks || blockIndex >= subtopic.learningBlocks.length) {
        console.error(`Invalid subtopic or block index: ${subtopicId}, ${blockIndex}`);
        return;
      }

      // Create a new array of learning blocks without the deleted block
      const updatedLearningBlocks = [...subtopic.learningBlocks];
      updatedLearningBlocks.splice(blockIndex, 1);

      // Update the subtopic with the new learning blocks array
      const updatedSubtopic = {
        ...subtopic,
        learningBlocks: updatedLearningBlocks
      };

      // Update the subtopic in the topic tree
      updateSubtopic(currentTopic.id, updatedSubtopic);

      // Update the selected node
      setSubtopic(updatedSubtopic);
    } catch (error) {
      console.error('Error deleting learning block:', error);
    }
  }, [currentTopic, updateSubtopic]);

  if (!currentTopic || !subtopic || !section) {
    return (
      <Box flex="1" px={4} py={6} overflowY="auto">
        <div>Loading subtopic...</div>
      </Box>
    );
  }

  return (
    <Box flex="1" px={4} py={6} overflowY="auto">
      <Box maxWidth="800px" mx="auto" p={6} bg="white" borderRadius="md">
        <Flex justify="flex-end" align="center" mb={4}>
          <Button
            colorScheme="brand"
            size="xs"
            onClick={handleBack}
          >
            Back to Topic
          </Button>
        </Flex>
        <SubtopicView
          key={subtopicId}
          section={section}
          subtopic={subtopic}
          onGenerateMaterial={handleGenerateLearningBlock}
          isGenerating={isGeneratingBlock}
          onGenerateQuiz={handleGenerateQuiz}
          isGeneratingQuiz={isGeneratingQuiz}
          onGenerateChoiceQuiz={handleGenerateChoiceQuiz}
          isGeneratingChoiceQuiz={isGeneratingChoiceQuiz}
          onDeleteBlock={handleDeleteBlock}
          onNavigateToSubtopic={handleNavigateToSubtopic}
          dfsNavigation={currentTopic ? getDFSNavigation(currentTopic, subtopic.id) : null}
        />
      </Box>
    </Box>
  );
};

export default SubtopicPage;
