import React, {useState} from 'react';
import {
  Box,
  Heading,
  Text,
  Icon,
  Flex,
  IconButton, Link, Image,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import {MaterialBlock} from "../../services/models.ts";
import {FaBook, FaChevronDown, FaChevronUp, FaTrash, FaLink} from 'react-icons/fa';

interface MaterialBlockProps {
  block: MaterialBlock;
  onDelete?: (block: MaterialBlock) => void;
}

/**
 * Component for displaying a material block
 */
const MaterialBlockView: React.FC<MaterialBlockProps> = ({block, onDelete}) => {
  const [isFolded, setIsFolded] = useState(false);
  const [areReferencesExpanded, setAreReferencesExpanded] = useState(false);

  const toggleFold = () => {
    setIsFolded(!isFolded);
  };

  const toggleReferences = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAreReferencesExpanded(!areReferencesExpanded);
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
          {block.title || "Material"}
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
          <Icon as={FaBook} color="blue.500" boxSize={4}/>
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
          <Box className="markdown-content">
            {Array.isArray(block.material) && (
              block.material.map((material, idx) => (
                <>
                  <ReactMarkdown key={idx}>{material.text}</ReactMarkdown>
                  <Image src={material.imageUrl} mt={4}/>
                  <Text fontSize="xs" mt={2} mb={2} textAlign="center">{material.imageDescription}</Text>
                </>
              ))
            )}
            {!Array.isArray(block.material) && (
              <ReactMarkdown>{block.material}</ReactMarkdown>
            )}
          </Box>


          {block.references && block.references.length > 0 && (
            <Box mt={4}>
              <Flex
                alignItems="center"
                cursor="pointer"
                onClick={toggleReferences}
                mb={areReferencesExpanded ? 2 : 0}
              >
                <Icon as={FaLink} color="blue.500" boxSize={3} mr={2}/>
                <Text fontSize="sm">
                  References
                </Text>
                <Icon as={areReferencesExpanded ? FaChevronUp : FaChevronDown} boxSize={3} ml={2}/>
              </Flex>
              {areReferencesExpanded && (
                <Flex pl={4} direction="column" gap={1}>
                  {block.references.map((reference, idx) => (
                    <Link key={idx} href={reference.url} isExternal>
                      <Text fontSize="sm">
                        - {reference.title}
                      </Text>
                    </Link>
                  ))}
                </Flex>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MaterialBlockView;
