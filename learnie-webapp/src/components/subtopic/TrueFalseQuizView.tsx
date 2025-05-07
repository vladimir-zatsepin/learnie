import React, {useState} from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Flex,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import {ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons';
import {TrueFalseQuizBlock} from "../../services/models.ts";
import {FaQuestionCircle, FaTrash, FaChevronDown, FaChevronUp} from 'react-icons/fa';

interface QuizBlockProps {
  block: TrueFalseQuizBlock;
  onQuizComplete?: (passed: boolean) => void;
  onDelete?: (block: TrueFalseQuizBlock) => void;
}

/**
 * Component for displaying a quiz block with multiple true/false questions
 */
const TrueFalseQuizView: React.FC<QuizBlockProps> = ({block, onQuizComplete, onDelete}) => {
  const [isFolded, setIsFolded] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(boolean | null)[]>(
    new Array(block.questions.length).fill(null)
  );
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(block.questions.length).fill(false)
  );
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  const toggleFold = () => {
    setIsFolded(!isFolded);
  };

  const buttonColorScheme = useColorModeValue('brand', 'teal');
  const selectedButtonColorScheme = 'blue';
  const correctButtonColorScheme = 'green';
  const incorrectButtonColorScheme = 'red';
  const explanationBgColor = useColorModeValue("gray.50", "gray.700");

  const currentQuestion = block.questions[currentQuestionIndex];
  const totalQuestions = block.questions.length;
  const answeredCount = answeredQuestions.filter(Boolean).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleAnswer = (answer: boolean) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newSelectedAnswers);

    // Immediately submit the answer when a True/False button is clicked
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestionIndex] = true;
    setAnsweredQuestions(newAnsweredQuestions);
  };


  const handleReset = () => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = null;
    setSelectedAnswers(newSelectedAnswers);

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestionIndex] = false;
    setAnsweredQuestions(newAnsweredQuestions);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      // Reset selection for the next question
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[currentQuestionIndex + 1] = null;
      setSelectedAnswers(newSelectedAnswers);

      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (answeredCount === totalQuestions) {
      setQuizCompleted(true);

      // Calculate if the quiz is passed (e.g., 70% correct answers)
      const correctAnswersCount = selectedAnswers.filter(
        (answer, index) => answer === block.questions[index].correctAnswer
      ).length;
      const passingThreshold = 0.7; // 70% correct answers to pass
      const quizPassed = correctAnswersCount / totalQuestions >= passingThreshold;

      // Update the local state
      setIsPassed(quizPassed);

      // Call the onQuizComplete callback if provided
      if (onQuizComplete) {
        onQuizComplete(quizPassed);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isCurrentQuestionAnswered = answeredQuestions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <Box width="100%" position="relative"  bg="white" borderWidth="1px" borderRadius="lg">
      <Flex
        p={4}
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        onClick={toggleFold}
        cursor="pointer"
      >
        <Heading as="h3" size="sm" mt={0}>
          {block.title || "Quiz"}
        </Heading>
        <Flex gap={2} alignItems="center">
          {onDelete && (
            <IconButton
              icon={<Icon as={FaTrash}/>}
              aria-label="Delete block"
              size="xs"
              colorScheme="red"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(block);
              }}
            />
          )}
          <Icon as={FaQuestionCircle} color="teal.500" boxSize={4}/>
          <Icon
            as={isFolded ? FaChevronDown : FaChevronUp}
            boxSize={4}
            ml={2}
          />
        </Flex>
      </Flex>

      {!isFolded && (
        <Box fontSize="md" className="quiz-content" overflow="auto" wordBreak="break-word" width="100%" p={4}>
          {/* Top navigation bar with progress indicator and navigation arrows */}
          <Flex mb={4} justifyContent="space-between" alignItems="center">
            <Box flex="1">
              <Text fontSize="sm" mb={1}>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Text>
              <Progress value={progress} size="sm" colorScheme="blue" borderRadius="md"/>
            </Box>
            <HStack spacing={2} ml={4}>
              <Button
                leftIcon={<ChevronLeftIcon/>}
                size="sm"
                onClick={handlePrevious}
                isDisabled={currentQuestionIndex === 0}
                variant="ghost"
                title="Previous question"
                aria-label="Previous question"
                fontSize="xs"
              >
                Prev
              </Button>
              <Button
                rightIcon={<ChevronRightIcon/>}
                size="sm"
                onClick={handleNext}
                isDisabled={!isCurrentQuestionAnswered}
                variant="ghost"
                colorScheme={currentQuestionIndex === totalQuestions - 1 && answeredCount === totalQuestions ? "green" : "blue"}
                title={currentQuestionIndex === totalQuestions - 1 && answeredCount === totalQuestions ? "Finish Quiz" : "Next question"}
                aria-label={currentQuestionIndex === totalQuestions - 1 && answeredCount === totalQuestions ? "Finish Quiz" : "Next question"}
                fontSize="xs"
              >
                {currentQuestionIndex === totalQuestions - 1 && answeredCount === totalQuestions ? "Finish" : "Next"}
              </Button>
            </HStack>
          </Flex>

          {block.questions.map((question, index) => (
            <Box key={index} display={index === currentQuestionIndex ? 'block' : 'none'} width="100%" mb={4}>
              <Text fontWeight="bold" mb={4}>
                {question.question}
              </Text>
            </Box>
          ))}

          <VStack spacing={4} align="stretch" mb={4}>
            <HStack spacing={4} justify="center">
              <Button
                colorScheme={
                  isCurrentQuestionAnswered
                    ? selectedAnswer === true
                      ? isCorrect
                        ? correctButtonColorScheme
                        : incorrectButtonColorScheme
                      : buttonColorScheme
                    : selectedAnswer === true
                      ? selectedButtonColorScheme
                      : buttonColorScheme
                }
                variant={selectedAnswer === true ? "solid" : "outline"}
                onClick={() => handleAnswer(true)}
                isDisabled={isCurrentQuestionAnswered}
                size="sm"
                width="100px"
              >
                True
              </Button>

              <Button
                colorScheme={
                  isCurrentQuestionAnswered
                    ? selectedAnswer === false
                      ? isCorrect
                        ? correctButtonColorScheme
                        : incorrectButtonColorScheme
                      : buttonColorScheme
                    : selectedAnswer === false
                      ? selectedButtonColorScheme
                      : buttonColorScheme
                }
                variant={selectedAnswer === false ? "solid" : "outline"}
                onClick={() => handleAnswer(false)}
                isDisabled={isCurrentQuestionAnswered}
                size="sm"
                width="100px"
              >
                False
              </Button>
            </HStack>

            {isCurrentQuestionAnswered && !quizCompleted && (
              <VStack spacing={4} align="stretch">
                <Alert
                  status={isCorrect ? "success" : "error"}
                  variant="subtle"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  borderRadius="md"
                  p={4}
                >
                  <Flex align="center">
                    <AlertIcon boxSize="24px" mr={2}/>
                    <AlertTitle mb={1} fontSize="lg">
                      {isCorrect ? "Correct!" : "Incorrect!"}
                    </AlertTitle>
                  </Flex>
                  <AlertDescription>
                    {currentQuestion.explanation && (
                      <Text mt={2} fontStyle="italic" fontSize="sm">
                        {currentQuestion.explanation}
                      </Text>
                    )}
                  </AlertDescription>
                </Alert>

                {!isCorrect && (
                  <Button
                    colorScheme="gray"
                    onClick={handleReset}
                    size="sm"
                    alignSelf="center"
                  >
                    Try Again
                  </Button>
                )}
                {isCorrect && (
                  <Button
                    colorScheme="green"
                    onClick={handleNext}
                    size="sm"
                    alignSelf="center"
                    rightIcon={<ChevronRightIcon/>}
                  >
                    {currentQuestionIndex === totalQuestions - 1 && answeredCount === totalQuestions ? "Finish" : "Next"}
                  </Button>
                )}
              </VStack>
            )}

          </VStack>

          {/* Quiz summary when completed */}
          {quizCompleted && (
            <Box mt={6} p={4} bg={explanationBgColor} borderRadius="md">
              <Alert
                status={isPassed ? "success" : "warning"}
                variant="subtle"
                borderRadius="md"
                mb={3}
              >
                <AlertIcon mr={2}/>
                <AlertTitle>
                  {isPassed ? "Congratulations! You passed the quiz." : "You didn't pass the quiz yet."}
                </AlertTitle>
              </Alert>
              <Button
                colorScheme="blue"
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setSelectedAnswers(new Array(block.questions.length).fill(null));
                  setAnsweredQuestions(new Array(block.questions.length).fill(false));
                  setQuizCompleted(false);
                }}
                size="sm"
              >
                Restart Quiz
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TrueFalseQuizView;
