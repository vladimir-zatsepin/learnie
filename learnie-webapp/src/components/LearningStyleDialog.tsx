import React, {useState, useContext, useEffect} from 'react';
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
    Select,
    VStack,
    Text,
    Box,
    Heading,
} from '@chakra-ui/react';
import {LearningContext} from '../contexts/LearningContextObject';
import {
    MaterialSize,
    MaterialStyle,
    QuizDifficulty,
    QuizSize,
    LearningStyle
} from '../services/models';
import {
    materialSizeDescriptions,
    materialStyleDescriptions,
    quizDifficultyDescriptions,
    quizSizeDescriptions
} from '../services/LearningStyleDescriptions';

interface LearningStyleDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LearningStyleDialog: React.FC<LearningStyleDialogProps> = ({isOpen, onClose}) => {
    const context = useContext(LearningContext);

    if (!context) {
        throw new Error('LearningStyleDialog must be used within a LearningProvider');
    }

    const {currentTopic, updateLearningStyle} = context;

    // Default learning style values
    const defaultLearningStyle: LearningStyle = {
        materialSize: MaterialSize.MEDIUM,
        materialStyle: MaterialStyle.STORYTELLING,
        quizDifficulty: QuizDifficulty.MEDIUM,
        quizSize: QuizSize.MEDIUM
    };

    // Local state to track changes before saving
    const [localStyle, setLocalStyle] = useState<LearningStyle>(
        currentTopic?.learningStyle || defaultLearningStyle
    );

    // Reset local state when dialog opens or current topic changes
    useEffect(() => {
        if (isOpen) {
            setLocalStyle(currentTopic?.learningStyle || defaultLearningStyle);
        }
    }, [isOpen, currentTopic]);

    const handleChange = (value: string, property: keyof LearningStyle) => {
        setLocalStyle(prev => ({
            ...prev,
            [property]: value
        }));
    };

    const handleSave = () => {
        // Only update if there's a current topic
        if (currentTopic) {
            updateLearningStyle(localStyle);
            onClose();
        } else {
            // If no current topic, just close the dialog
            onClose();
        }
    };

    // No need for collections with traditional Select component

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Vibe Learning Styling</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Text mb={4}>
                        Customize your learning experience by adjusting these settings.
                    </Text>

                    <VStack spacing={4} align="stretch">
                        <Box>
                            <Heading as="h3" size="sm" mb={2}>
                                Materials
                            </Heading>

                            <FormControl mb={3}>
                                <FormLabel>Size</FormLabel>
                                <Select
                                    value={localStyle.materialSize}
                                    onChange={(e) => handleChange(e.target.value, 'materialSize')}
                                >
                                    <option value={MaterialSize.SMALL}>Small - Concise content with essential information</option>
                                    <option value={MaterialSize.MEDIUM}>Medium - Balanced content with good detail</option>
                                    <option value={MaterialSize.LARGE}>Large - Comprehensive content with in-depth explanations</option>
                                </Select>
                                <Text fontSize="sm" color="gray.500" mt={1}>
                                    {materialSizeDescriptions[localStyle.materialSize as MaterialSize]}
                                </Text>
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>Style</FormLabel>
                                <Select
                                    value={localStyle.materialStyle}
                                    onChange={(e) => handleChange(e.target.value, 'materialStyle')}
                                >
                                    <option value={MaterialStyle.STORYTELLING}>Story-telling - Narrative approach with flowing explanations</option>
                                    <option value={MaterialStyle.BULLETIN_POINTS}>Bulletin Points - Structured list format for easy scanning</option>
                                </Select>
                                <Text fontSize="sm" color="gray.500" mt={1}>
                                    {materialStyleDescriptions[localStyle.materialStyle as MaterialStyle]}
                                </Text>
                            </FormControl>
                        </Box>

                        <Box>
                            <Heading as="h3" size="sm" mb={2}>
                                Quizzes
                            </Heading>

                            <FormControl mb={3}>
                                <FormLabel>Difficulty</FormLabel>
                                <Select
                                    value={localStyle.quizDifficulty}
                                    onChange={(e) => handleChange(e.target.value, 'quizDifficulty')}
                                >
                                    <option value={QuizDifficulty.BASIC}>Basic - Fundamental concepts for beginners</option>
                                    <option value={QuizDifficulty.MEDIUM}>Medium - Balanced complexity for intermediate learners</option>
                                    <option value={QuizDifficulty.ADVANCED}>Advanced - Challenging questions requiring deeper understanding</option>
                                </Select>
                                <Text fontSize="sm" color="gray.500" mt={1}>
                                    {quizDifficultyDescriptions[localStyle.quizDifficulty as QuizDifficulty]}
                                </Text>
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>Size</FormLabel>
                                <Select
                                    value={localStyle.quizSize}
                                    onChange={(e) => handleChange(e.target.value, 'quizSize')}
                                >
                                    <option value={QuizSize.SMALL}>Small - Few questions for quick review</option>
                                    <option value={QuizSize.MEDIUM}>Medium - Balanced number of questions</option>
                                    <option value={QuizSize.LARGE}>Large - Comprehensive set of questions</option>
                                </Select>
                                <Text fontSize="sm" color="gray.500" mt={1}>
                                    {quizSizeDescriptions[localStyle.quizSize as QuizSize]}
                                </Text>
                            </FormControl>
                        </Box>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="brand" color="white" _hover={{ bg: "brand600" }} onClick={handleSave}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
