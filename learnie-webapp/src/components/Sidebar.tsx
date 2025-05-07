import React, {useState, useEffect} from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Divider,
  List,
  ListItem,
  InputGroup,
  InputLeftElement,
  Input,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {SearchIcon, SettingsIcon} from '@chakra-ui/icons';
import {useLearning} from '../hooks/useLearning';
import {useNavigate, useLocation} from 'react-router-dom';
import {useSettings} from '../hooks/useSettings';
import SettingsModal from './SettingsModal';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItemBg = useColorModeValue('brand.100', 'brand.900');
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {settings} = useSettings();

  // Check if API key is not set and open settings dialog
  useEffect(() => {
    if (!settings.ai.apiKey) {
      onOpen();
    }
  }, [settings.ai.apiKey, onOpen]);

  // State for topic search
  const [searchQuery, setSearchQuery] = useState('');

  const {
    topics,
    currentTopic,
    removeTopic
  } = useLearning();

  // Handle creating a new topic
  const handleLearnNew = () => {
    navigate('/');
  };

  // Handle selecting a topic
  const handleSelectTopic = (topicId: string) => {
    navigate(`/topics/${topicId}`);
  };

  // Handle removing a topic
  const handleRemoveTopic = (e: React.MouseEvent, topicId: string) => {
    // Prevent the click from propagating to the parent (which would select the topic)
    e.stopPropagation();

    // Remove the topic
    removeTopic(topicId);

    // If we're currently viewing this topic or one of its subtopics, navigate to home
    if (location.pathname.includes(`/topics/${topicId}`)) {
      navigate('/');
    }
  };

  return (
    <Box
      width="260px"
      height="100%"
      bg="gray.100"
      p={2}
      pt={3}
      borderRight="1px"
      borderColor="gray.300"
      overflowY="auto"
      alignItems="baseline"
      textAlign="left"
      position="relative"
    >
      <Flex direction="column" width="100%" mb={3} alignItems="flex-start">
        <Button
          colorScheme="brand"
          size="sm"
          width="100%"
          onClick={handleLearnNew}
          textAlign="left"
        >
          Learn new
        </Button>
      </Flex>

      <Divider my={2}/>

      {/* Search input */}
      <InputGroup mb={2} bg="white" borderRadius="md">
        <InputLeftElement pointerEvents="none" height="100%" display="flex" alignItems="center">
          <SearchIcon color="gray.300"/>
        </InputLeftElement>
        <Input
          placeholder="Search topics"
          size="sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      <List spacing={0} textAlign="left">
        <ListItem
          key={'header'}
          p={1}
          py={2}
          pl={2}
          borderRadius="sm"
        >
          <Text
            fontSize="md"
            textAlign="left"
          >
            Topics
          </Text>
        </ListItem>
        {topics
          .filter(topic =>
            topic.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(topic => (
            <ListItem
              key={topic.id}
              p={1}
              py={0.5}
              pl={2}
              my={1}
              borderRadius="sm"
              cursor="pointer"
              borderLeft={currentTopic && currentTopic.id === topic.id ? "2px solid" : "2px solid transparent"}
              borderLeftColor={currentTopic && currentTopic.id === topic.id ? "brand.500" : "transparent"}
              bg={currentTopic && currentTopic.id === topic.id ? selectedItemBg : 'transparent'}
              _hover={{bg: 'gray.300'}}
              onClick={() => handleSelectTopic(topic.id)}
            >
              <Flex justify="space-between" align="center">
                <Text
                  fontSize="sm"
                  fontWeight={currentTopic && currentTopic.id === topic.id ? 'bold' : 'normal'}
                  textAlign="left"
                  flex="1"
                >
                  {topic.title}
                </Text>
                <Button
                  size="xs"
                  colorScheme="red"
                  variant="ghost"
                  onClick={(e) => handleRemoveTopic(e, topic.id)}
                  opacity="0.6"
                  _hover={{opacity: 1}}
                  aria-label="Remove topic"
                >
                  ✕
                </Button>
              </Flex>
            </ListItem>
          ))}
      </List>

      {/* Settings button at the bottom */}
      <Flex
        position="absolute"
        bottom="10px"
        left="10px"
        width="calc(100% - 20px)"
        justifyContent="center"
      >
        <Button
          aria-label="Settings"
          size="sm"
          variant="outline"
          colorScheme="gray"
          onClick={onOpen}
        >
          <SettingsIcon mr={1}/> AI Settings
        </Button>
      </Flex>

      {/* Settings Modal */}
      <SettingsModal isOpen={isOpen} onClose={onClose}/>
    </Box>
  );
};

export default Sidebar;
