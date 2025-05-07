import React from 'react';
import { Box } from '@chakra-ui/react';

// Define the word data structure
interface WordData {
  text: string;
  value: number;
}

// Popular learning topics with their relative importance (value)
const popularTopics: WordData[] = [
  { text: 'JavaScript', value: 100 },
  { text: 'Python', value: 95 },
  { text: 'Machine Learning', value: 90 },
  { text: 'Data Science', value: 85 },
  { text: 'React', value: 80 },
  { text: 'Artificial Intelligence', value: 75 },
  { text: 'Web Development', value: 70 },
  { text: 'Mathematics', value: 65 },
  { text: 'Physics', value: 60 },
  { text: 'Chemistry', value: 55 },
  { text: 'Biology', value: 50 },
  { text: 'History', value: 45 },
  { text: 'Literature', value: 40 },
  { text: 'Economics', value: 35 },
  { text: 'Statistics', value: 30 },
  { text: 'Algorithms', value: 25 },
  { text: 'Node.js', value: 20 },
  { text: 'TypeScript', value: 15 },
  { text: 'CSS', value: 10 },
  { text: 'HTML', value: 5 },
  { text: 'Cloud Computing', value: 85 },
  { text: 'DevOps', value: 80 },
  { text: 'Cybersecurity', value: 75 },
  { text: 'Blockchain', value: 70 },
  { text: 'UI/UX Design', value: 65 },
  { text: 'Mobile Development', value: 60 },
  { text: 'Database', value: 55 },
  { text: 'SQL', value: 50 },
  { text: 'NoSQL', value: 45 },
  { text: 'Git', value: 40 },
];

// Since we're not using an actual word cloud library (to avoid adding dependencies),
// we'll create a simple component that displays words with varying sizes and positions
const WordCloudBackground: React.FC = () => {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={-1}
      overflow="hidden"
      pointerEvents="none" // Make sure the background doesn't interfere with user interactions
    >
      {popularTopics.map((word, index) => {
        // Calculate random position and size based on word value
        const size = (word.value / 20) + 10; // Font size between 10px and 15px
        const opacity = 0.05 + (word.value / 1000); // Opacity between 0.05 and 0.15
        const top = `${Math.random() * 90}%`;
        const left = `${Math.random() * 90}%`;
        const rotation = Math.random() * 60 - 30; // Random rotation between -30 and 30 degrees

        return (
          <Box
            key={index}
            position="absolute"
            top={top}
            left={left}
            transform={`rotate(${rotation}deg)`}
            fontSize={`${size}px`}
            fontWeight={word.value > 50 ? "bold" : "normal"}
            color="gray.300"
            whiteSpace="nowrap"
          >
            {word.text}
          </Box>
        );
      })}
    </Box>
  );
};

export default WordCloudBackground;
