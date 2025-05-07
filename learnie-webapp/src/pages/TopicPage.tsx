import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Text,
  Flex,
} from '@chakra-ui/react';
import {useParams, useNavigate} from 'react-router-dom';
import TopicListView from '../components/TopicListView';
import {LearnieAgentFactory} from '../services/ai';
import {useLearning} from "../hooks/useLearning";

const TopicPage: React.FC = () => {
  const {topicId} = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const [isGeneratingSubtopic, setIsGeneratingSubtopic] = useState(false);

  const {setCurrentTopic, currentTopic, addNodeToTopic, removeSubtopic} = useLearning();

  useEffect(() => {
    if (topicId) {
      setCurrentTopic(topicId);
    }
  }, [topicId, setCurrentTopic]);

  const handleNodeClick = useCallback((nodeId: string) => {
    if (topicId) {
      // Extract the actual node ID if it has the "node-" prefix
      const actualNodeId = nodeId.startsWith('node-') ? nodeId.substring(5) : nodeId;
      navigate(`/topics/${topicId}/subtopics/${actualNodeId}`);
    }
  }, [topicId, navigate]);

  // Handle generating a new subtopic for a parent subtopic
  const handleGenerateSubtopic = useCallback(async (parentSubtopicId: string, generalContext?: string) => {
    if (!currentTopic || !topicId) return;

    try {
      setIsGeneratingSubtopic(true);

      // Get the AI provider from the factory
      const aiProvider = LearnieAgentFactory.getAgent();

      // Generate the new subtopic
      const newSubtopic = await aiProvider.generateSubtopic(currentTopic, parentSubtopicId, generalContext);

      // Add the new subtopic to the parent's children
      addNodeToTopic(currentTopic.id, parentSubtopicId, newSubtopic);

      // Don't navigate to the new subtopic
    } catch (error) {
      console.error('Error generating subtopic:', error);
    } finally {
      setIsGeneratingSubtopic(false);
    }
  }, [currentTopic, topicId, addNodeToTopic]);

  // Handle removing a subtopic
  const handleRemoveSubtopic = useCallback((subtopicId: string) => {
    if (!currentTopic || !topicId) return;

    // Don't allow removing the root node or first-level subtopics
    if (subtopicId === 'root') {
      return;
    }

    // Check if this is a first-level subtopic in any section
    if (currentTopic.sections && Array.isArray(currentTopic.sections)) {
      for (const section of currentTopic.sections) {
        if (section.subtopics && Array.isArray(section.subtopics)) {
          for (const subtopic of section.subtopics) {
            if (subtopic.id === subtopicId) {
              return; // Don't allow removing first-level subtopics
            }
          }
        }
      }
    }

    // Remove the subtopic
    removeSubtopic(currentTopic.id, subtopicId);
  }, [currentTopic, topicId, removeSubtopic]);

  if (!currentTopic) {
    return (
      <Box flex="1" px={4} py={6} overflowY="auto">
        <Text>Loading topic...</Text>
      </Box>
    );
  }

  return (
    <Box flex="1" px={4} py={6} overflowY="auto">
      <Box maxWidth="800px" mx="auto" p={6} bg="white" borderRadius="md" position="relative">
        <Flex justifyContent="center" alignItems="center" mb={4}>
          <Text fontSize="xl" fontWeight="bold">
            {currentTopic.title}
          </Text>
        </Flex>

        <Flex justify="space-between" align="center" m={4} alignItems="flex-end">
          <Text>
            Sections
          </Text>
        </Flex>
        <TopicListView
          topic={currentTopic}
          onNodeClick={handleNodeClick}
          onGenerateSubtopic={handleGenerateSubtopic}
          isGeneratingSubtopic={isGeneratingSubtopic}
          onRemoveSubtopic={handleRemoveSubtopic}
          addNodeToTopic={addNodeToTopic}
        />
      </Box>
    </Box>
  );
};

export default TopicPage;
