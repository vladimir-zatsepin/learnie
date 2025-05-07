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
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import {ViewIcon, ViewOffIcon} from '@chakra-ui/icons';
import OpenAI from 'openai';
import ChatModel = OpenAI.ChatModel;
import {useSettings} from "../hooks/useSettings";

// Define available models with their display names
const AVAILABLE_MODELS: { value: ChatModel; displayName: string }[] = [
  {value: `gpt-4.1`, displayName: `GPT-4.1`},
  {value: 'gpt-4.1-mini', displayName: 'GPT-4.1 Mini'},
  // {value: 'gpt-4.1-nano', displayName: `GPT-4.1 Nano`},
  // {value: 'gpt-4', displayName: 'GPT-4'},
  // {value: 'gpt-4-turbo', displayName: 'GPT-4 Turbo'},
  {value: 'gpt-4o', displayName: 'GPT-4o'},
];

// Define available providers with their display names
const AVAILABLE_PROVIDERS: { value: 'openai' | 'remote'; displayName: string }[] = [
  {value: 'openai', displayName: 'OpenAI'},
  {value: 'remote', displayName: 'Hybrid (OpenAI & Gemini Agent)'},
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({isOpen, onClose}) => {
  const {settings, updateApiKey, updateModel, updateProvider} = useSettings();
  const toast = useToast();

  // Local state for form values
  const [apiKey, setApiKey] = useState(settings.ai.apiKey);
  const [model, setModel] = useState(settings.ai.model);
  const [provider, setProvider] = useState(settings.ai.provider);
  const [showApiKey, setShowApiKey] = useState(false);

  // Handle form submission
  const handleSave = () => {
    // Validate API key format
    if (!apiKey || !apiKey.startsWith('sk-')) {
      toast({
        title: 'Invalid API Key',
        description: 'API key must start with "sk-"',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Update settings
    updateApiKey(apiKey);
    updateModel(model);
    updateProvider(provider);

    // Show success toast
    toast({
      title: 'Settings saved',
      description: 'Your AI settings have been updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // Close the modal
    onClose();
  };

  // Toggle API key visibility
  const toggleShowApiKey = () => setShowApiKey(!showApiKey);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>AI Settings</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl id="apiKey" isRequired>
              <FormLabel>OpenAI API Key</FormLabel>
              <InputGroup>
                <Input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                    icon={showApiKey ? <ViewOffIcon/> : <ViewIcon/>}
                    onClick={toggleShowApiKey}
                    variant="ghost"
                    size="sm"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl id="model" isRequired>
              <FormLabel>AI Model</FormLabel>
              <Select
                value={model}
                onChange={(e) => setModel(e.target.value as ChatModel)}
              >
                {AVAILABLE_MODELS.map((modelOption) => (
                  <option key={modelOption.value} value={modelOption.value}>
                    {modelOption.displayName}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl id="provider" isRequired>
              <FormLabel>AI Provider</FormLabel>
              <Select
                value={provider}
                onChange={(e) => setProvider(e.target.value as 'openai' | 'remote')}
              >
                {AVAILABLE_PROVIDERS.map((providerOption) => (
                  <option key={providerOption.value} value={providerOption.value}>
                    {providerOption.displayName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="brand" onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
