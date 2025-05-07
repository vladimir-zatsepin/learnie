import React from 'react';
import {Box} from '@chakra-ui/react';
import LearnNewForm from '../components/LearnNewForm';
import {useNavigate} from 'react-router-dom';

const NewTopicPage: React.FC = () => {
  const navigate = useNavigate();

  const handleTopicCreated = (topicId: string) => {
    // Navigate to the topic view page with the new topic ID
    navigate(`/topics/${topicId}`);
  };

  return (
    <Box flex="1" px={4} py={6} overflowY="auto" position="relative">
      {/*<WordCloudForNewTopic />*/}
      <LearnNewForm onTopicCreated={handleTopicCreated}/>
    </Box>
  );
};

export default NewTopicPage;
