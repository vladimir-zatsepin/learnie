import {useContext} from 'react';
import {LearningContext} from '../contexts/LearningContextObject';

// Custom hook for using the context
export const useLearning = () => {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
