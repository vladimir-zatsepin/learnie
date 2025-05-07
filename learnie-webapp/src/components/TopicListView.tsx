import React, {useState} from 'react';
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { CircleLoader } from 'react-spinners';
import {FaBook, FaCheckCircle, FaEllipsisV, FaPlus, FaQuestionCircle, FaTrash} from 'react-icons/fa';
import {LearningBlockType, Subtopic, TrueFalseQuizBlock, Topic} from "../services/models";
import AddSubtopicModal from './AddSubtopicModal';
import {LearnieAgentFactory} from '../services/ai';

interface TopicListProps {
  onNodeClick: (nodeId: string) => void;
  onGenerateSubtopic?: (subtopicId: string, generalContext?: string) => void;
  isGeneratingSubtopic?: boolean;
  onRemoveSubtopic?: (subtopicId: string) => void;
  topic?: Topic; // The full topic object for generating suggestions
  addNodeToTopic?: (topicId: string, parentSubtopicId: string, newSubtopic: Subtopic) => void;
}

const TopicListView: React.FC<TopicListProps> = ({
                                                   onNodeClick,
                                                   onGenerateSubtopic,
                                                   isGeneratingSubtopic,
                                                   onRemoveSubtopic,
                                                   topic,
                                                   addNodeToTopic
                                                 }) => {

  // State for the add subtopic modal
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>('');
  const [selectedSubtopicTitle, setSelectedSubtopicTitle] = useState<string>('');
  const [subtopicSuggestions, setSubtopicSuggestions] = useState<Array<{ title: string, description: string }>>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const toast = useToast();

  // Function to open the add subtopic modal
  const handleOpenAddSubtopicModal = (subtopicId: string, subtopicTitle: string) => {
    setSelectedSubtopicId(subtopicId);
    setSelectedSubtopicTitle(subtopicTitle);
    setSubtopicSuggestions([]);
    onOpen();
  };

  // Function to generate suggestions on demand
  const handleGenerateSuggestions = async () => {
    if (!topic || !selectedSubtopicId) return;

    try {
      setIsLoadingSuggestions(true);
      const aiProvider = LearnieAgentFactory.getAgent();
      const subtopic = await aiProvider.generateSubtopicSuggestions(topic, selectedSubtopicId);
      // Convert the Subtopic to the expected format for suggestions
      const suggestions = [{
        title: subtopic.title,
        description: subtopic.summary || ''
      }];
      setSubtopicSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching subtopic suggestions:', error);
      toast({
        title: 'Error fetching suggestions',
        description: 'Could not load subtopic suggestions. You can still create a custom subtopic.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Function to handle adding a subtopic with a custom prompt or from suggestions
  const handleAddSubtopic = (customPrompt: string, isSuggestion?: boolean, suggestion?: {
    title: string,
    description: string
  }) => {
    if (selectedSubtopicId) {
      if (isSuggestion && suggestion && topic && addNodeToTopic) {
        // If it's a suggestion, create a subtopic directly without generating
        const newSubtopic: Subtopic = {
          id: `${selectedSubtopicId}-child-${Date.now()}`,
          title: suggestion.title,
          summary: suggestion.description,
          order: 1, // Default order, will be adjusted when added to the parent
        };

        // Add the subtopic directly to the topic
        addNodeToTopic(topic.id, selectedSubtopicId, newSubtopic);
      } else if (onGenerateSubtopic) {
        // If it's a custom prompt, generate a subtopic using the AI
        onGenerateSubtopic(selectedSubtopicId, customPrompt);
      }
      onClose();
    }
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setSubtopicSuggestions([]);
    onClose();
  };


  // Color mode values for light/dark theme support
  const bgColor = useColorModeValue('white', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const subheadingColor = useColorModeValue('gray.600', 'gray.300');
  const overlayBg = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(26, 32, 44, 0.7)');

  // Helper function to count material blocks
  const countMaterialBlocks = (subtopic: Subtopic): number => {
    const materialBlocks = subtopic.learningBlocks?.filter(
      block => block.type === LearningBlockType.MATERIAL
    ) || [];
    return materialBlocks.length;
  };

  // Helper function to count passed quizzes
  const countPassedQuizzes = (subtopic: Subtopic): number => {
    const passedQuizBlocks = subtopic.learningBlocks?.filter(
      block => block.type === LearningBlockType.QUIZ_TRUE_FALSE && (block as TrueFalseQuizBlock).passed
    ) || [];
    return passedQuizBlocks.length;
  };

  // Helper function to count all quizzes
  const countAllQuizzes = (subtopic: Subtopic): number => {
    const quizBlocks = subtopic.learningBlocks?.filter(
      block => block.type === LearningBlockType.QUIZ_TRUE_FALSE
    ) || [];
    return quizBlocks.length;
  };




  // Function to render sections as cards
  const renderSections = () => {
    if (!topic || !topic.sections || !Array.isArray(topic.sections)) {
      return <Text>No sections available</Text>;
    }

    return (
      <SimpleGrid columns={{base: 1, sm: 1, md: 1, lg: 1}} spacing={4}>
        {topic.sections.map((section, index) => (
          <Box
            key={`section-${index}`}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
            bg={bgColor}
            boxShadow="md"
            transition="all 0.2s"
          >
            <Flex justify="space-between" align="center" mb={3}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={headingColor}
                textAlign="left"
              >
                {section.title}
              </Text>
              {onGenerateSubtopic && section.subtopics && section.subtopics.length > 0 && (
                <Menu>
                  <MenuButton
                    as={Button}
                    size="xs"
                    variant="ghost"
                    aria-label="More options"
                  >
                    <Icon as={FaEllipsisV} fontSize="xs"/>
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => handleOpenAddSubtopicModal(section.subtopics[0].id, section.title)}
                      isDisabled={isGeneratingSubtopic}
                      icon={<Icon as={FaPlus} fontSize="xs"/>}
                    >
                      {isGeneratingSubtopic ? "Generating..." : "Add Subtopic"}
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </Flex>

            {section.imageUrl && (
              <Box mb={3} borderRadius="md" overflow="hidden">
                <Image
                  src={section.imageUrl}
                  alt={`Image for ${section.title}`}
                  width="100%"
                  height="auto"
                  maxHeight="200px"
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/800x200?text=No+Image"
                />
              </Box>
            )}

            {section.subtopics && section.subtopics.length > 0 ? (
              <Box key={`subtopics-${index}`}>
                {section.subtopics.map((subtopic) => {
                  const materialCount = countMaterialBlocks(subtopic);
                  const totalQuizCount = countAllQuizzes(subtopic);
                  const passedQuizCount = countPassedQuizzes(subtopic);

                  return (
                    <Box
                      key={subtopic.id}
                      p={2}
                      mb={2}
                      borderWidth="1px"
                      borderRadius="md"
                      _hover={{ bg: "gray.50" }}
                      cursor="pointer"
                      onClick={() => onNodeClick(subtopic.id)}
                    >
                      <Flex justify="space-between" align="center">
                        <Flex align="center" flex="1">
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={headingColor}
                            mr={1}
                          >
                            {subtopic.title}
                          </Text>
                          <HStack spacing={1} ml={1}>
                            {(subtopic.learningBlocks && subtopic.learningBlocks.length > 0) && (
                              <>
                                {materialCount > 0 && (
                                  <Tooltip label={`${materialCount} learning material${materialCount !== 1 ? 's' : ''}`}>
                                    <Badge
                                      colorScheme="blue"
                                      variant="subtle"
                                      borderRadius="md"
                                      px={1}
                                      display="flex"
                                      alignItems="center"
                                    >
                                      <Icon as={FaBook} mr={1} fontSize="xs"/>
                                      <Text>{materialCount}</Text>
                                    </Badge>
                                  </Tooltip>
                                )}
                                {totalQuizCount > 0 && (
                                  <Tooltip
                                    label={`${passedQuizCount} of ${totalQuizCount} quiz${totalQuizCount !== 1 ? 'zes' : ''} passed`}>
                                    <Badge
                                      colorScheme={passedQuizCount === totalQuizCount ? "green" : passedQuizCount > 0 ? "yellow" : "gray"}
                                      variant="subtle"
                                      borderRadius="md"
                                      px={1}
                                      display="flex"
                                      alignItems="center"
                                    >
                                      <Icon as={passedQuizCount === totalQuizCount ? FaCheckCircle : FaQuestionCircle} mr={1}
                                            fontSize="xs"/>
                                      <Text>{passedQuizCount}/{totalQuizCount}</Text>
                                    </Badge>
                                  </Tooltip>
                                )}
                              </>
                            )}
                          </HStack>
                        </Flex>
                        <HStack spacing={1}>
                          {(onGenerateSubtopic || (onRemoveSubtopic && subtopic.id !== 'root')) && (
                            <Menu>
                              <MenuButton
                                as={Button}
                                size="xs"
                                variant="ghost"
                                onClick={(e) => e.stopPropagation()}
                                aria-label="More options"
                              >
                                <Icon as={FaEllipsisV} fontSize="xs"/>
                              </MenuButton>
                              <MenuList onClick={(e) => e.stopPropagation()}>
                                {onRemoveSubtopic && subtopic.id !== 'root' && (
                                  <MenuItem
                                    onClick={() => onRemoveSubtopic(subtopic.id)}
                                    icon={<Icon as={FaTrash} fontSize="xs"/>}
                                  >
                                    Remove subtopic
                                  </MenuItem>
                                )}
                              </MenuList>
                            </Menu>
                          )}
                        </HStack>
                      </Flex>
                      {subtopic.summary && (
                        <Text
                          fontSize="xs"
                          color={subheadingColor}
                          mt={1}
                          noOfLines={2}
                          textAlign="left"
                        >
                          {subtopic.summary}
                        </Text>
                      )}
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Text fontSize="sm" color={subheadingColor}>No subtopics available</Text>
            )}
          </Box>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <Box
      width="100%"
      borderRadius="md"
      bg={bgColor}
      p={3}
      position="relative"
    >

      {isGeneratingSubtopic && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg={overlayBg}
          zIndex="10"
          borderRadius="md"
        >
          <Center height="100%">
            <CircleLoader
              size={50}
              color="var(--chakra-colors-brand-500)"
            />
            <Text ml={4} fontWeight="bold" color={headingColor}>
              Generating subtopic...
            </Text>
          </Center>
        </Box>
      )}
      {renderSections()}

      {/* Add Subtopic Modal */}
      <AddSubtopicModal
        isOpen={isOpen}
        onClose={handleModalClose}
        onAddSubtopic={handleAddSubtopic}
        isGenerating={isGeneratingSubtopic || false}
        parentSubtopicTitle={selectedSubtopicTitle}
        suggestions={subtopicSuggestions}
        isLoadingSuggestions={isLoadingSuggestions}
        onGenerateSuggestions={handleGenerateSuggestions}
      />
    </Box>
  );
};

export default TopicListView;
