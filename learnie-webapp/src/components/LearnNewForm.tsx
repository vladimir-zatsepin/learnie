import {useState, useCallback} from 'react'
import {
  VStack,
  Text,
  Input,
  Flex,
  Textarea,
  FormControl,
  FormLabel,
  Select,
  Box,
  Switch, Icon
} from '@chakra-ui/react'
import LoadingButton from './LoadingButton'
import {LearnieAgentFactory} from '../services/ai'
import {useLearning} from "../hooks/useLearning";
import {LearningPlanStyle, LearningPlanType} from "../services/models";
import {learningPlanTypeDescriptions} from "../services/LearningStyleDescriptions";
import {FaMagic} from "react-icons/fa";

interface LearnNewFormProps {
  onTopicCreated?: (topicId: string) => void;
}

function LearnNewForm({onTopicCreated}: LearnNewFormProps) {
  // State for the new topic form
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Learning plan type state
  const [learningPlanType, setLearningPlanType] = useState<LearningPlanType>(LearningPlanType.EXPLORER)
  const [learningPlanTypePrompt, setLearningPlanTypePrompt] = useState<string>('')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  const {addTopic, setCurrentTopic} = useLearning()

  // Function to handle learning
  const handleLearn = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter what you would like to learn')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      // Get the AI provider from the factory
      const aiProvider = LearnieAgentFactory.getAgent()

      let newTopicId: string;
      try {
        // Create learning plan style object
        const learningPlanStyle: LearningPlanStyle = {
          learningPlanType: learningPlanType
        };

        // Add custom prompt if provided
        if (learningPlanTypePrompt.trim()) {
          learningPlanStyle.learningPlanTypePrompt = learningPlanTypePrompt.trim();
        }

        // Generate a topic from the user's input with learning plan style
        const topic = await aiProvider.generateTopic(prompt, learningPlanStyle)

        addTopic(topic)
        newTopicId = topic.id
      } catch (treeError) {
        console.error('Error generating tree content:', treeError)
        return
      }

      if (onTopicCreated) {
        onTopicCreated(newTopicId)
      } else {
        setCurrentTopic(newTopicId)
      }
      setPrompt('')
    } catch (err) {
      console.error('Error generating learning content:', err)
      setError('Failed to generate learning content. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [prompt, addTopic, setCurrentTopic, onTopicCreated, learningPlanType, learningPlanTypePrompt])

  return (
    <VStack width="100%" maxWidth="600px" mx="auto" mt="20vh">
      <Flex width="100%" justify="center" align="center" direction="column" gap={4}>
        <Flex width="100%" justify="center" align="center" direction="column" gap={2}>
          <Flex width="100%" justify="center" align="center">
            <Input
              placeholder="What would you like to learn today?"
              size="md"
              width="100%"
              mr={2}
              bg="white"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLearn()}
              disabled={isLoading}
            />
            <LoadingButton
              colorScheme="brand"
              size="md"
              onClick={handleLearn}
              isLoading={isLoading}
              loadingText="Generating..."
              disabled={isLoading}
            >
              Learn
            </LoadingButton>
          </Flex>

          {/* Vibe Switch */}
          <Flex width="100%" justify="space-between" align="center" mb={2}>
            <Box bgGradient="linear(to-r, purple.400, pink.400)" borderRadius="md" p={2} mr={2} cursor="pointer">
              <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='vibing' mb='0' color="white">
                  <Icon as={FaMagic} mr={1}/> Vibe options
                </FormLabel>
                <Switch id='vibing'
                        isChecked={showAdvancedOptions}
                        onChange={() => setShowAdvancedOptions(!showAdvancedOptions)}
                        colorScheme="purple.400"
                        size="md"
                        disabled={isLoading}/>
              </FormControl>
            </Box>
          </Flex>

          {/* Advanced Options (shown when switch is on) */}
          {showAdvancedOptions && (
            <Box width="100%" mb={2} p={4} borderWidth="1px" borderRadius="md">
              {/* Learning Plan Type Selection */}
              <FormControl width="100%" mb={2}>
                <FormLabel fontSize="sm">Learning Plan Type</FormLabel>
                <Select
                  onChange={(e) => setLearningPlanType(e.target.value as LearningPlanType)}
                  disabled={isLoading}
                  size="sm"
                  defaultValue={LearningPlanType.EXPLORER}
                >
                  <option value={LearningPlanType.EXPLORER}>
                    Explorer - A flexible, discovery-based learning approach
                  </option>
                  <option value={LearningPlanType.ACHIEVER}>
                    Achiever - A goal-oriented, structured approach
                  </option>
                  <option value={LearningPlanType.SOCIAL_LEARNER}>
                    Social Learner - A collaborative learning experience
                  </option>
                </Select>
                <Text fontSize="xs" color="gray.500" mt={1} align="left">
                  {learningPlanTypeDescriptions[learningPlanType]}
                </Text>
              </FormControl>

              {/* Custom Prompt for Learning Plan Type */}
              <FormControl width="100%" mb={2}>
                <FormLabel fontSize="sm">Custom Prompt (Optional)</FormLabel>
                <Textarea
                  placeholder="Enter a custom prompt for this learning plan type..."
                  value={learningPlanTypePrompt}
                  onChange={(e) => setLearningPlanTypePrompt(e.target.value)}
                  disabled={isLoading}
                  size="sm"
                  rows={3}
                />
                <Text fontSize="xs" color="gray.500" mt={1} align="left">
                  Customize how the AI generates content for this learning plan type. Leave empty to use the default.
                </Text>
              </FormControl>
            </Box>
          )}
        </Flex>

        {error && (
          <Text color="red.500" fontSize="sm" textAlign="center">
            {error}
          </Text>
        )}
      </Flex>

    </VStack>
  )
}

export default LearnNewForm
