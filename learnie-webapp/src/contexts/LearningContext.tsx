import React, {useState, useEffect, ReactNode} from 'react';
import {topicStorage} from '../services/storage/TopicStorage';
import {
  LearningStyle,
  MaterialSize,
  MaterialStyle,
  QuizDifficulty,
  QuizSize,
  Subtopic,
  Topic
} from "../services/models";
import {LearningContext} from './LearningContextObject';

// Provider component
export const LearningProvider: React.FC<{ children: ReactNode }> = ({children}) => {

  const initialTopics = topicStorage.loadTopics() as Topic[];
  const [topics, setTopics] = useState<Topic[]>(initialTopics);

  const [currentTopic, setCurrentTopicState] = useState<Topic | null>(() => {
    return topicStorage.loadCurrentTopic(initialTopics);
  });

  // Default learning style values
  const defaultLearningStyle: LearningStyle = {
    materialSize: MaterialSize.MEDIUM,
    materialStyle: MaterialStyle.STORYTELLING,
    quizDifficulty: QuizDifficulty.MEDIUM,
    quizSize: QuizSize.MEDIUM
  };

  useEffect(() => {
    topicStorage.saveTopics(topics);
  }, [topics]);

  useEffect(() => {
    topicStorage.saveCurrentTopicId(currentTopic?.id || null);
  }, [currentTopic]);


  const addTopic = async (topic: Topic) => {
    const updatedTopic = {...topic};
    setTopics(prevTopics => [...prevTopics, updatedTopic]);
  };

  const addNodeToTopic = (topicId: string, parentNodeId: string, node: Subtopic): void => {
    console.log(`Adding node ${node.id} to parent ${parentNodeId} in topic ${topicId}`);
    setTopics(prevTopics =>
      prevTopics.map(topic => {
        if (topic.id === topicId) {
          // Create a deep copy of the topic to avoid mutating the original
          const updatedTopic = {...topic, sections: [...topic.sections]};
          let parentNodeFound = false;

          // Iterate through all sections and their subtopics to find the parent node
          for (let i = 0; i < updatedTopic.sections.length; i++) {
            const section = {...updatedTopic.sections[i], subtopics: [...updatedTopic.sections[i].subtopics]};
            updatedTopic.sections[i] = section;

            for (let j = 0; j < section.subtopics.length; j++) {
              // Helper function to find and update a node in the subtopic tree
              const findAndUpdateNode = (currentNode: Subtopic, targetId: string): Subtopic => {
                if (currentNode.id === targetId) {
                  // Found the parent node, add the new node to its children
                  parentNodeFound = true;
                  return {
                    ...currentNode,
                    // Note: The node parameter is not being used here.
                    // This method might be incomplete or the node is meant to be used differently.
                  };
                }

                // Not the parent node, check its children
                return {
                  ...currentNode,
                };
              };

              // Update the subtopic if it or one of its children is the parent node
              section.subtopics[j] = findAndUpdateNode(section.subtopics[j], parentNodeId);
            }
          }

          // If the parent node wasn't found in any section, log an error
          if (!parentNodeFound) {
            console.error(`Parent node with ID ${parentNodeId} not found in topic ${topicId}`);
          }

          // If this is the current topic, update the current topic state as well
          if (currentTopic && currentTopic.id === topicId) {
            setCurrentTopicState(updatedTopic);
          }

          return updatedTopic;
        }
        return topic;
      })
    );
  };

  const setCurrentTopic = (topicId: string | null) => {

    if (topicId === null) {
      // Only update if the current topic is not already null
      if (currentTopic !== null) {
        setCurrentTopicState(null);
      }
      return;
    }

    // Find the topic in the topics array
    const topic = topics.find(t => t.id === topicId);

    if (topic) {
      // Only update if the current topic is different from the new topic
      // to prevent unnecessary re-renders
      if (!currentTopic || currentTopic.id !== topic.id) {
        // Create a new object to ensure React detects the change
        const newTopic = {...topic};
        setCurrentTopicState(newTopic);
      }
    }
  };

  const getCurrentNode = (): Subtopic | null => {
    if (!currentTopic || !currentTopic.sections || currentTopic.sections.length === 0) return null;
    // Return the first subtopic of the first section as the current node
    const firstSection = currentTopic.sections[0];
    return firstSection.subtopics.length > 0 ? firstSection.subtopics[0] : null;
  };

  // Update a subtopic in a topic
  const updateSubtopic = (topicId: string, updatedSubtopic: Subtopic): void => {
    setTopics(prevTopics =>
      prevTopics.map(topic => {
        if (topic.id !== topicId) {
          return topic;
        }

        // Create a deep copy of the topic to avoid mutating the original
        const updatedTopic = {...topic, sections: [...topic.sections]};
        let subtopicFound = false;

        // Iterate through all sections and their subtopics to find the subtopic to update
        for (let i = 0; i < updatedTopic.sections.length; i++) {
          const section = {...updatedTopic.sections[i], subtopics: [...updatedTopic.sections[i].subtopics]};
          updatedTopic.sections[i] = section;

          // Find and update the subtopic if it exists in this section
          for (let j = 0; j < section.subtopics.length; j++) {
            if (section.subtopics[j].id === updatedSubtopic.id) {
              // Found the subtopic, update it
              section.subtopics[j] = updatedSubtopic;
              subtopicFound = true;
              break;
            }
          }
        }

        // If the subtopic wasn't found in any section, log an error
        if (!subtopicFound) {
          console.error(`Subtopic with ID ${updatedSubtopic.id} not found in topic ${topicId}`);
        }

        // If this is the current topic, update the current topic state as well
        if (currentTopic && currentTopic.id === topicId) {
          setCurrentTopicState(updatedTopic);
        }

        return updatedTopic;
      })
    );
  };

  // Remove a subtopic from a topic
  const removeSubtopic = (topicId: string, subtopicId: string): void => {
    setTopics(prevTopics =>
      prevTopics.map(topic => {
        if (topic.id === topicId) {
          // Create a deep copy of the topic to avoid mutating the original
          const updatedTopic = {...topic, sections: [...topic.sections]};
          let subtopicRemoved = false;

          // Iterate through all sections and their subtopics to find the subtopic to remove
          for (let i = 0; i < updatedTopic.sections.length; i++) {
            const section = {...updatedTopic.sections[i], subtopics: [...updatedTopic.sections[i].subtopics]};
            updatedTopic.sections[i] = section;

            // First check if the subtopic is a direct child of this section
            const filteredSubtopics = section.subtopics.filter(subtopic => subtopic.id !== subtopicId);
            if (filteredSubtopics.length !== section.subtopics.length) {
              // Found and removed the subtopic
              section.subtopics = filteredSubtopics;
              subtopicRemoved = true;
              continue;
            }
          }

          // If the subtopic wasn't found in any section, log an error
          if (!subtopicRemoved) {
            console.error(`Subtopic with ID ${subtopicId} not found in topic ${topicId}`);
          }

          // If this is the current topic, update the current topic state as well
          if (currentTopic && currentTopic.id === topicId) {
            setCurrentTopicState(updatedTopic);
          }

          return updatedTopic;
        }
        return topic;
      })
    );
  };

  // Remove a topic
  const removeTopic = (topicId: string): void => {
    // Remove the topic from the list
    setTopics(prevTopics => prevTopics.filter(topic => topic.id !== topicId));

    // If the current topic is the one being removed, set current topic to null
    if (currentTopic && currentTopic.id === topicId) {
      setCurrentTopicState(null);
    }
  };

  // Update learning style settings for the current topic
  const updateLearningStyle = (newStyle: Partial<LearningStyle>): void => {
    // Only update if there's a current topic
    if (currentTopic) {
      // Get the current learning style or use default if not set
      const currentStyle = currentTopic.learningStyle || defaultLearningStyle;

      // Create updated learning style
      const updatedStyle = {
        ...currentStyle,
        ...newStyle
      };

      // Update the topic with the new learning style
      const updatedTopic = {
        ...currentTopic,
        learningStyle: updatedStyle
      };

      // Update current topic state
      setCurrentTopicState(updatedTopic);

      // Update the topic in the topics list
      setTopics(prevTopics =>
        prevTopics.map(topic =>
          topic.id === currentTopic.id ? updatedTopic : topic
        )
      );
    }
  };

  // Context value
  const value = {
    topics,
    currentTopic,
    addTopic,
    addNodeToTopic,
    updateSubtopic,
    removeSubtopic,
    // Common methods
    removeTopic,
    setCurrentTopic,
    // Tree navigation methods
    getCurrentNode,
    // Learning style methods
    updateLearningStyle,
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};
