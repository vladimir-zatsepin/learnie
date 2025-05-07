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
    LearningPlanType
} from '../services/models';
import {
    learningPlanTypeDescriptions
} from '../services/LearningStyleDescriptions';

interface LearningPlanTypeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialPlanType?: LearningPlanType;
    onPlanTypeChange?: (planType: LearningPlanType) => void;
}

export const LearningPlanTypeDialog: React.FC<LearningPlanTypeDialogProps> = ({
    isOpen,
    onClose,
    initialPlanType,
    onPlanTypeChange
}) => {
    const context = useContext(LearningContext);

    // Default learning plan type
    const defaultLearningPlanType: LearningPlanType = LearningPlanType.EXPLORER;

    // Local state to track changes before saving
    const [localPlanType, setLocalPlanType] = useState<LearningPlanType>(
        initialPlanType || (context?.currentTopic?.learningPlanType) || defaultLearningPlanType
    );

    // Reset local state when dialog opens or initial plan type changes
    useEffect(() => {
        if (isOpen) {
            setLocalPlanType(initialPlanType || (context?.currentTopic?.learningPlanType) || defaultLearningPlanType);
        }
    }, [isOpen, initialPlanType, context?.currentTopic]);

    const handleChange = (value: string) => {
        setLocalPlanType(value as LearningPlanType);
    };

    const handleSave = () => {
        // If we have a callback, use it
        if (onPlanTypeChange) {
            onPlanTypeChange(localPlanType);
        }
        // If we have a context and current topic, update it there too
        else if (context && context.currentTopic) {
            context.updateLearningPlanType(localPlanType);
        }

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Learning Plan Type</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Text mb={4}>
                        Choose a learning plan type that best fits your learning style and goals.
                    </Text>

                    <VStack spacing={4} align="stretch">
                        <Box>
                            <Heading as="h3" size="sm" mb={2}>
                                Learning Plan Type
                            </Heading>

                            <FormControl mb={3}>
                                <FormLabel>Type</FormLabel>
                                <Select
                                    value={localPlanType}
                                    onChange={(e) => handleChange(e.target.value)}
                                >
                                    <option value={LearningPlanType.EXPLORER}>Explorer - A flexible, discovery-based learning approach</option>
                                    <option value={LearningPlanType.ACHIEVER}>Achiever - A goal-oriented, structured approach with clear milestones</option>
                                    <option value={LearningPlanType.SOCIAL_LEARNER}>Social Learner - A collaborative learning experience with community interaction</option>
                                </Select>
                                <Text fontSize="sm" color="gray.500" mt={1}>
                                    {learningPlanTypeDescriptions[localPlanType as LearningPlanType]}
                                </Text>
                            </FormControl>
                        </Box>
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
