import React, {useState} from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  VStack,
  Text,
  Box,
  Divider,
  Heading,
  Card,
  CardBody,
  Stack,
  useColorModeValue,
  Spinner,
  Center, Input,
} from '@chakra-ui/react';

interface SubtopicSuggestion {
  title: string;
  description: string;
}

interface AddSubtopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSubtopic: (customPrompt: string, isSuggestion?: boolean, suggestion?: SubtopicSuggestion) => void;
  isGenerating: boolean;
  parentSubtopicTitle: string;
  suggestions?: SubtopicSuggestion[];
  isLoadingSuggestions?: boolean;
  onGenerateSuggestions?: () => void;
}

const AddSubtopicModal: React.FC<AddSubtopicModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             onAddSubtopic,
                                                             isGenerating,
                                                             parentSubtopicTitle,
                                                             suggestions = [],
                                                             isLoadingSuggestions = false,
                                                             onGenerateSuggestions,
                                                           }) => {
  // Local state for form values
  const [customPrompt, setCustomPrompt] = useState('');

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.600');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.600');

  // Handle form submission
  const handleAdd = () => {
    if (customPrompt.trim()) {
      onAddSubtopic(customPrompt, false);
      setCustomPrompt(''); // Clear the input after submission
    }
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (suggestion: SubtopicSuggestion) => {
    onAddSubtopic(`Create a subtopic about "${suggestion.title}". ${suggestion.description}`, true, suggestion);
  };

  // Clear the input when the modal is closed
  const handleClose = () => {
    setCustomPrompt('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>Add Subtopic to "{parentSubtopicTitle}"</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Suggested subtopics section */}
            <Box>
              <Heading size="sm" mb={2}>
                Suggested Subtopics
              </Heading>
              {isLoadingSuggestions ? (
                <Center p={6}>
                  <Spinner size="md"/>
                  <Text ml={3}>Loading suggestions...</Text>
                </Center>
              ) : suggestions.length > 0 ? (
                <Stack spacing={3}>
                  {suggestions.map((suggestion, index) => (
                    <Card
                      key={index}
                      variant="outline"
                      borderColor={cardBorderColor}
                      bg={cardBg}
                      _hover={{bg: cardHoverBg, cursor: 'pointer'}}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <CardBody p={3}>
                        <Heading size="sm" mb={1}>{suggestion.title}</Heading>
                        <Text fontSize="sm">{suggestion.description}</Text>
                      </CardBody>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Box>
                  <Button
                    colorScheme="brand"
                    size="sm"
                    onClick={onGenerateSuggestions}
                    isLoading={isLoadingSuggestions}
                    loadingText="Generating..."
                    isDisabled={!onGenerateSuggestions}
                    width="100%"
                  >
                    Generate Suggestions
                  </Button>
                </Box>
              )}
            </Box>

            <Divider/>

            {/* Custom prompt section */}
            <Box>
              <Heading size="sm" mb={2}>
                Custom Subtopic
              </Heading>
              <FormControl id="customPrompt">
                <Input
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe what you want to learn about..."
                  size="md"
                />
              </FormControl>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={isGenerating}>
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleAdd}
            isLoading={isGenerating}
            loadingText="Generating..."
            isDisabled={!customPrompt.trim() || isGenerating}
          >
            Add Custom Subtopic
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddSubtopicModal;
