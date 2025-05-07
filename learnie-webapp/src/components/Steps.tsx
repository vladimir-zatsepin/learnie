import React from 'react';
import { Box, VStack, Circle, Flex } from '@chakra-ui/react';

interface StepsProps {
  children: React.ReactNode[];
  activeStep?: number;
}

/**
 * Steps component that connects children components with a vertical line and step indicators
 */
const Steps: React.FC<StepsProps> = ({ children, activeStep = -1 }) => {
  return (
    <VStack spacing={0} width="100%" position="relative" align="center">
      {/* Vertical line that connects all steps */}
      <Box
        position="absolute"
        top="0"
        bottom="0"
        width="2px"
        bg="gray.200"
        zIndex={0}
        left="24px"
      />

      {children.map((child, index) => (
        <Flex key={index} width="100%" direction="column" align="flex-start">
          {/* Step indicator */}
          {index > 0 && (
            <Circle
              size="10px"
              bg={index <= activeStep ? "green.500" : "gray.300"}
              my={4}
              ml="20px"
              zIndex={1}
            />
          )}

          {/* Child component (LearningBlock) */}
          <Box width="100%" zIndex={1}>
            {child}
          </Box>
        </Flex>
      ))}
    </VStack>
  );
};

export default Steps;
