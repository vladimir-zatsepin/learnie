import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Icon,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { GameBlock } from "../../services/models.ts";
import { FaGamepad, FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';

interface GameBlockProps {
  block: GameBlock;
  onDelete?: (block: GameBlock) => void;
}

/**
 * Component for displaying a game block
 */
const GameBlockView: React.FC<GameBlockProps> = ({ block, onDelete }) => {
  const [isFolded, setIsFolded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && !isFolded) {
      const iframe = iframeRef.current;
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;

      if (iframeDocument) {
        iframeDocument.open();
        iframeDocument.write(block.htmlContent);
        iframeDocument.close();
      }
    }
  }, [block.htmlContent, isFolded]);

  const toggleFold = () => {
    setIsFolded(!isFolded);
  };

  return (
    <Box width="100%" position="relative" borderWidth="1px" borderRadius="lg" bg="white">
      <Flex
        p={4}
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        onClick={toggleFold}
        cursor="pointer"
      >
        <Heading as="h3" size="sm" my={0}>
          {block.title || "Interactive Game"}
        </Heading>
        <Flex gap={2} alignItems="center">
          {onDelete && (
            <IconButton
              icon={<Icon as={FaTrash} />}
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
          <Icon as={FaGamepad} color="green.500" boxSize={4} />
          <Icon
            as={isFolded ? FaChevronDown : FaChevronUp}
            boxSize={4}
            ml={2}
          />
        </Flex>
      </Flex>

      {!isFolded && (
        <Box fontSize="md" overflow="auto" wordBreak="break-word" width="100%" p={4}>
          {block.summary && (
            <Text fontSize="sm" fontStyle="italic" color="gray.600" mb={3}>
              {block.summary}
            </Text>
          )}
          <Box className="game-content">
            <iframe
              ref={iframeRef}
              title={block.title || "Interactive Game"}
              width="100%"
              height="810px"
              style={{
                border: 'none',
                backgroundColor: 'white'
              }}
              sandbox="allow-scripts allow-same-origin"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default GameBlockView;
