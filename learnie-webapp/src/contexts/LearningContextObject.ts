import {createContext} from 'react';
import {LearningStyle, Subtopic, Topic} from "../services/models";

// Define the context state and functions
export interface LearningContextType {
  topics: Topic[];
  currentTopic: Topic | null;

  // Topic methods
  addTopic: (topic: Topic) => void;
  addNodeToTopic: (topicId: string, parentNodeId: string, node: Subtopic) => void; // Adds a node to an existing topic
  updateSubtopic: (topicId: string, updatedSubtopic: Subtopic) => void; // Updates a subtopic in a topic
  removeSubtopic: (topicId: string, subtopicId: string) => void; // Removes a subtopic from a topic

  // Common methods
  removeTopic: (topicId: string) => void; // Removes a topic
  setCurrentTopic: (topicId: string | null) => void;
  updateLearningStyle: (newStyle: Partial<LearningStyle>) => void; // Updates learning style settings
}

// Create the context with a default value
export const LearningContext = createContext<LearningContextType | undefined>(undefined);
