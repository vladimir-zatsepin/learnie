import React, {useState} from 'react';
import {
  VStack,
  Text,
  Box,
  Flex,
  Button,
  useColorModeValue,
  HStack,
  Divider,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  useDisclosure,
} from '@chakra-ui/react';
import LoadingButton from '../LoadingButton';
import {CircleLoader} from 'react-spinners';
import {Section, Subtopic} from "../../services/models";
import LearningBlockView from './LearningBlockView';
import Steps from './../Steps';
import {FaTrash, FaEllipsisV, FaBook, FaPlay, FaQuestionCircle, FaPlus, FaListOl, FaMagic} from 'react-icons/fa';
import {LearningStyleDialog} from '../LearningStyleDialog';


interface LearningBlockProps {
  section: Section,
  subtopic: Subtopic;
  onGenerateMaterial: (subtopicId: string, prompt?: string) => void;
  isGenerating?: boolean;
  onGenerateQuiz: (subtopicId: string) => void;
  isGeneratingQuiz?: boolean;
  onGenerateChoiceQuiz: (subtopicId: string) => void;
  isGeneratingChoiceQuiz?: boolean;
  onGenerateSubtopic?: (subtopicId: string, generalContext?: string) => void;
  isGeneratingSubtopic?: boolean;
  onRemoveSubtopic?: (subtopicId: string) => void;
  onDeleteBlock: (subtopicId: string, blockIndex: number) => void;
  dfsNavigation: { previous: Subtopic | null, next: Subtopic | null } | null;
  onNavigateToSubtopic: (subtopicId: string) => void;
}

/**
 * Component for displaying learning content
 */
const SubtopicView: React.FC<LearningBlockProps> = ({
                                                      section,
                                                      subtopic,
                                                      onGenerateMaterial,
                                                      isGenerating,
                                                      onGenerateQuiz,
                                                      isGeneratingQuiz,
                                                      onGenerateChoiceQuiz,
                                                      isGeneratingChoiceQuiz,
                                                      onGenerateSubtopic,
                                                      isGeneratingSubtopic,
                                                      onRemoveSubtopic,
                                                      onDeleteBlock,
                                                      onNavigateToSubtopic,
                                                      dfsNavigation
                                                    }) => {
  const blocks = subtopic.learningBlocks || [];
  const breadcrumbBg = useColorModeValue('gray.100', 'gray.600');
  const [learnMorePrompt, setLearnMorePrompt] = useState('');
  const {isOpen, onOpen, onClose} = useDisclosure();

  // Use only DFS navigation without fallbacks
  let hasPrevious = false, hasNext = false, previousSubtopic = null, nextSubtopic = null;

  if (dfsNavigation) {
    hasPrevious = !!dfsNavigation.previous;
    hasNext = !!dfsNavigation.next;
    previousSubtopic = dfsNavigation.previous;
    nextSubtopic = dfsNavigation.next;
  }

  return (
    <VStack width="100%" maxWidth="800px" mx="auto" position="relative">
      {/* Breadcrumb navigation */}
      <Box width="100%">
        <Flex
          justify="space-between"
          align="center"
          p={2}
          bg={breadcrumbBg}
          borderRadius="md"
        >
          <HStack spacing={2} overflow="hidden">
            <Text fontSize="sm" color="gray.500" noOfLines={1}>
              {section.title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              /
            </Text>
            <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
              {subtopic.title}
            </Text>
          </HStack>
          <HStack spacing={2}>
            {hasPrevious && previousSubtopic && (
              <Button
                size="xs"
                variant="ghost"
                onClick={() => onNavigateToSubtopic(previousSubtopic.id)}
                leftIcon={<Text>←</Text>}
              >
                Previous
              </Button>
            )}
            {hasNext && nextSubtopic && (
              <Button
                size="xs"
                variant="ghost"
                onClick={() => onNavigateToSubtopic(nextSubtopic.id)}
                rightIcon={<Text>→</Text>}
              >
                Next
              </Button>
            )}
          </HStack>
        </Flex>
        <Divider my={2}/>
      </Box>

      <Flex justify="flex-end" width="100%">
        {/* Learning Style Button */}
        <Button
          aria-label="Learning Style Settings"
          size="sm"
          variant="solid"
          colorScheme="purple"
          onClick={onOpen}
          borderRadius="full"
          boxShadow="md"
          _hover={{transform: 'rotate(5deg)'}}
          position="relative"
          zIndex={1}
          bgGradient="linear(to-r, purple.400, pink.400)"
        >
          <Icon as={FaMagic} mr={1}/>
          Vibe
        </Button>
      </Flex>

      <Flex align="start" width="100%">
        <VStack spacing={2} align="stretch" textAlign="left" width="100%">
          {blocks.length === 0 ? (
            <VStack spacing={4} width="100%">
              <LoadingButton
                colorScheme="brand"
                size="sm"
                onClick={() => {
                  onGenerateMaterial(subtopic.id);
                }}
                isLoading={isGenerating}
                loadingText="Generating..."
                leftIcon={<Icon as={FaPlay}/>}
              >
                Start learning
              </LoadingButton>
            </VStack>
          ) : (
            <>
              <Steps>
                {blocks.map((block, index) => (
                  <LearningBlockView
                    key={index}
                    block={block}
                    subtopicId={subtopic.id}
                    onDelete={(block) => {
                      const blockType = block.type;
                      if (window.confirm(`Are you sure you want to delete this ${blockType} block?`)) {
                        onDeleteBlock(subtopic.id, index);
                      }
                    }}
                  />
                ))}
              </Steps>
              <Flex mt={4} gap={2} justify="flex-end">
                <InputGroup size="sm" maxWidth="300px">
                  <Input
                    placeholder="What would you like to learn more about?"
                    value={learnMorePrompt}
                    onChange={(e) => setLearnMorePrompt(e.target.value)}
                    disabled={isGenerating}
                  />
                </InputGroup>
                <LoadingButton
                  colorScheme="brand"
                  size="sm"
                  onClick={() => {
                    onGenerateMaterial(subtopic.id, learnMorePrompt);
                    setLearnMorePrompt('');
                  }}
                  isLoading={isGenerating}
                  leftIcon={<Icon as={FaBook}/>}
                >
                  Learn more
                </LoadingButton>
                <Menu>
                  <MenuButton
                    as={Button}
                    colorScheme="teal"
                    size="sm"
                    disabled={isGeneratingQuiz || isGeneratingChoiceQuiz}
                    leftIcon={isGeneratingQuiz || isGeneratingChoiceQuiz ?
                      <Flex align="center" justify="center">
                        <CircleLoader size={16} color="var(--chakra-colors-teal-500)"/>
                      </Flex> :
                      <Icon as={FaQuestionCircle}/>
                    }
                  >
                    {isGeneratingQuiz || isGeneratingChoiceQuiz ? "Generating..." : "Practice"}
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      icon={<Icon as={FaQuestionCircle}/>}
                      onClick={() => onGenerateQuiz(subtopic.id)}
                      isDisabled={isGeneratingQuiz || isGeneratingChoiceQuiz}
                    >
                      True/False Quiz
                    </MenuItem>
                    <MenuItem
                      icon={<Icon as={FaListOl}/>}
                      onClick={() => onGenerateChoiceQuiz(subtopic.id)}
                      isDisabled={isGeneratingQuiz || isGeneratingChoiceQuiz}
                    >
                      Multiple Choice Quiz
                    </MenuItem>
                  </MenuList>
                </Menu>
                {hasNext && nextSubtopic && (
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => onNavigateToSubtopic(nextSubtopic.id)}
                    rightIcon={<Text>→</Text>}
                  >
                    Next Topic
                  </Button>
                )}
                {(onGenerateSubtopic || (onRemoveSubtopic && subtopic.id !== 'root')) && (
                  <Menu>
                    <MenuButton
                      as={Button}
                      size="sm"
                      variant="ghost"
                      aria-label="More options"
                    >
                      <Icon as={FaEllipsisV}/>
                    </MenuButton>
                    <MenuList>
                      {onGenerateSubtopic && (
                        <MenuItem
                          onClick={() => onGenerateSubtopic(subtopic.id, undefined)}
                          isDisabled={isGeneratingSubtopic}
                          icon={<Icon as={FaPlus}/>}
                        >
                          {isGeneratingSubtopic ? "Generating subtopic..." : "Generate Subtopic"}
                        </MenuItem>
                      )}
                      {onRemoveSubtopic && subtopic.id !== 'root' && (
                        <MenuItem
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove "${subtopic.title}"?`)) {
                              onRemoveSubtopic(subtopic.id);
                            }
                          }}
                          icon={<Icon as={FaTrash}/>}
                        >
                          Remove Subtopic
                        </MenuItem>
                      )}
                    </MenuList>
                  </Menu>
                )}
              </Flex>
            </>
          )}
        </VStack>
      </Flex>

      {/* Learning Style Dialog */}
      <LearningStyleDialog isOpen={isOpen} onClose={onClose}/>
    </VStack>
  );
};

export default SubtopicView;
