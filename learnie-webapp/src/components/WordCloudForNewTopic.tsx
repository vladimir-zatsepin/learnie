import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import { Box } from '@chakra-ui/react';

// Define the word data structure (compatible with react-wordcloud)
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

// Options for the word cloud
const options = {
  colors: ['#CCCCCC', '#BBBBBB', '#AAAAAA', '#999999'],
  enableTooltip: false,
  deterministic: false,
  fontFamily: 'impact',
  fontSizes: [15, 60],
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  rotations: 3,
  rotationAngles: [-30, 30],
  scale: 'sqrt',
  spiral: 'archimedean',
  transitionDuration: 1000,
};

const WordCloudForNewTopic: React.FC = () => {
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
      opacity={0.1} // High transparency
      width="100%"
      height="100%"
    >
      <ReactWordcloud words={popularTopics} options={options} size={[500, 500]} />
    </Box>
  );
};

export default WordCloudForNewTopic;
