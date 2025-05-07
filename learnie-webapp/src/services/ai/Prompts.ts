import {Subtopic, Topic} from "../models.ts";

const jsonFormatPrompt = `
  Only output raw, compact JSON with no formatting, explanation, or markdown. Do not use line breaks or indentation. Just return the JSON object.
`;

export function generateClarificationQuestionsPrompt(
  prompt: string,
  previousQAContext: string,
  questionNumber?: number
): string {
  return `
  I want to learn about: "${prompt}"

  Generate question #${questionNumber} that would help you better understand what I want to learn.
  This question should build upon the previous questions and answers to dig deeper or explore new aspects.

  Previous questions and answers:
  ${previousQAContext}

  Return the question in JSON format as an array with a single object with a "question" property:
   [
     { "question": "Your follow-up question based on previous context?" }
   ]

   ${jsonFormatPrompt}
  `;
}

export function generateTopicPrompt(
  prompt: string,
  clarificationInfo: string
): string {
  return `
  Generate a tailored learning plan for a user aspiring to learn the following topic:
  ${prompt}

  ${clarificationInfo}

  Follow these steps to create an effective learning plan:
  - Focus on the specific topic: "${prompt}"
  - Within each section, create subtopics that represent specific concepts or skills
  - Each subtopic should be a fundamental concept or area within its section
  - Make subtopics clear and distinct from each other
  - Include a concise summary of not more than 144 characters for each subtopic that describes its content and purpose
  - Suggest resources tailored to the topic
  - Generate at least 3 sections and 3 subtopics for each section

  Generate a structure where:
  - The topic is organized into sections
  - Each section contains multiple subtopics
  - Ensure subtopic IDs follow the pattern: 'subtopic-0', 'subtopic-1', etc.
  - IMPORTANT: Assign an "order" number to each subtopic that represents the sequence in which they should be learned
    - Subtopics within each section should have sequential order numbers (1, 2, 3, etc.)
    - The order should reflect a logical learning progression from foundational to more advanced concepts

  The content will be used to create a Topic with the following structure:
  {
    "id": "ID of the topic", // Generate meaningful ID e.g. introduction-in-qa-123
    "title": "Title of the topic",
    "subject": "Subject of the topic",
    "sections": [
      {
        "title": "Section 1 Title",
        "subtopics": [
          {
            "id": "subtopic-0",
            "title": "Subtopic 1",
            "summary": "Concise summary of the subtopic content and purpose (max 144 characters)"
          },
          {
            "id": "subtopic-1",
            "title": "Subtopic 2",
            "summary": "Concise summary of the subtopic content and purpose (max 144 characters)"
          }
        ]
      },
      {
        "title": "Section 2 Title",
        "subtopics": [
          {
            "id": "subtopic-2",
            "title": "Subtopic 3",
            "order": 1, // Order in which this should be learned (1, 2, 3, etc.)
            "summary": "Concise summary of the subtopic content and purpose (max 144 characters)"
          }
        ]
      }
    ]
  }

  ${jsonFormatPrompt}
  `;
}

export function generateLearningBlockPrompt(
  topic: { title: string; subject: string },
  subtopic: { title: string; id: string },
  subtopicSummary: string,
  prompt?: string,
  learningStylePrompt?: string
): string {
  return `
  Generate a learning block for the subtopic: "${subtopic.title}" (ID: ${subtopic.id})

  Topic Summary:
    - Topic: ${topic.title}
    - Subject: ${topic.subject}

  ${subtopicSummary ? `Already Covered Material:
  ${subtopicSummary}` : ''}

  ${prompt ? `User's specific request:
  ${prompt}` : ''}

  ${learningStylePrompt ? `User's learning style preferences:
  ${learningStylePrompt}` : ''}

  The learning material should:
  - Be relevant to the subtopic "${subtopic.title}"
  - Be formatted in markdown
  - Be comprehensive but concise (about 1-minute read)
  - Include a concise summary that captures the key points of the material
  - Dont include header or title
  - Include 2-3 references to high-quality external resources (articles, documentation, tutorials, etc.) that provide additional information on the topic
  - IMPORTANT: Search for current, up-to-date resources and ensure all URLs are valid and accessible
  - Each reference should have a descriptive title and a valid URL
  - Do not use outdated links or references from your training data
  - Build upon the already covered material without repeating the same content
  - Provide new insights, examples, or deeper explanations that complement the existing blocks
  - Include examples where appropriate
  - Include code blocks where appropriate in the subject is software development related
  - Include images into material mark down where appropriate
  - Adapt to the user's learning style preferences if provided

  Create a learning block with the following structure:
  {
    "title": "Learning Block Title",
    "material": "Learning material in markdown format",
    "summary": "A concise summary of the learning material (up to 280 characters)",
    "references": [
      {
        "title": "Reference Title",
        "url": "https://example.com/reference-url"
      }
    ],
    "type": "MATERIAL"
  }

  ${jsonFormatPrompt}
  `;
}

export function generateTrueFalseQuizPrompt(
  subtopic: { title: string; id: string },
  subtopicSummary: string,
  learningStylePrompt?: string
): string {
  return `
  Generate a true/false quiz with multiple questions for the subtopic: "${subtopic.title}" (ID: ${subtopic.id})

  ${subtopicSummary ? `Material to base the quiz on (use ONLY this material):
  ${subtopicSummary}` : 'Note: There are no learning blocks available for this subtopic yet.'}

  ${learningStylePrompt ? `User's learning style preferences:
  ${learningStylePrompt}` : ''}

   The quiz should:
  - Be relevant to the subtopic "${subtopic.title}"
  - Include 3-5 clear, unambiguous true/false questions
  - Include a brief introduction or context in the material field
  - Be challenging but fair based ONLY on the provided learning blocks
  - Have definitive correct answers (true or false) for each question
  - Include a concise explanation (up to 144 characters) for each question explaining why the answer is true or false
  - Cover different aspects of the material provided
  - DO NOT include information from outside the provided learning blocks
  - If no learning blocks are provided, create very basic questions about the subtopic title only
  - Adapt to the user's learning style preferences if provided

  Create a true/false quiz with the following structure:
  {
    "title": "Quiz Title",
    "material": "Brief context or introduction for the quiz in markdown format",
    "summary": "A concise summary of what this quiz tests (up to 280 characters)",
    "type": "QUIZ_TRUE_FALSE",
    "questions": [
      {
        "question": "A clear true/false question about the topic",
        "correctAnswer": true or false,
        "explanation": "Brief explanation of why the answer is true or false (up to 144 characters)"
      },
      {
        "question": "Another clear true/false question about the topic",
        "correctAnswer": true or false,
        "explanation": "Brief explanation of why the answer is true or false (up to 144 characters)"
      },
      {
        "question": "A third clear true/false question about the topic",
        "correctAnswer": true or false,
        "explanation": "Brief explanation of why the answer is true or false (up to 144 characters)"
      }
    ]
  }

  ${jsonFormatPrompt}
  `;
}

export function generateChoiceQuizPrompt(
  subtopic: { title: string; id: string },
  subtopicSummary: string,
  learningStylePrompt?: string
): string {
  return `
  Generate a multiple choice quiz with several questions for the subtopic: "${subtopic.title}" (ID: ${subtopic.id})

  ${subtopicSummary ? `Material to base the quiz on (use ONLY this material):
  ${subtopicSummary}` : 'Note: There are no learning blocks available for this subtopic yet.'}

  ${learningStylePrompt ? `User's learning style preferences:
  ${learningStylePrompt}` : ''}

  The quiz should:
  - Be relevant to the subtopic "${subtopic.title}"
  - Include 3-5 clear, unambiguous multiple choice questions
  - Each question should have 4 options (A, B, C, D)
  - Include a brief introduction or context in the material field
  - Be challenging but fair based ONLY on the provided learning blocks
  - Have one definitive correct answer for each question
  - Include a concise explanation (up to 144 characters) for each question explaining why the correct answer is right
  - Cover different aspects of the material provided
  - DO NOT include information from outside the provided learning blocks
  - If no learning blocks are provided, create very basic questions about the subtopic title only
  - Adapt to the user's learning style preferences if provided

  Create a multiple choice quiz with the following structure:
  {
    "title": "Multiple Choice Quiz Title",
    "material": "Brief context or introduction for the quiz in markdown format",
    "summary": "A concise summary of what this quiz tests (up to 280 characters)",
    "type": "QUIZ_CHOICE",
    "questions": [
      {
        "question": "A clear multiple choice question about the topic",
        "options": [
          "Option A",
          "Option B",
          "Option C",
          "Option D"
        ],
        "correctOptionIndex": 0, // Index of the correct option (0 for Option A, 1 for Option B, etc.)
        "explanation": "Brief explanation of why the answer is correct (up to 144 characters)"
      },
      {
        "question": "Another clear multiple choice question about the topic",
        "options": [
          "Option A",
          "Option B",
          "Option C",
          "Option D"
        ],
        "correctOptionIndex": 1, // Index of the correct option (0 for Option A, 1 for Option B, etc.)
        "explanation": "Brief explanation of why the answer is correct (up to 144 characters)"
      }
    ]
  }

  ${jsonFormatPrompt}
  `;
}

export function generateSubtopicSuggestionsPrompt(
  topic: Topic,
  topicStructure: string,
  parentSubtopic: Subtopic,
  siblingSubtopics: string[],
): string {
  return `
  Generate 3 suggestions for new subtopics for the parent subtopic: "${parentSubtopic.title}" (ID: ${parentSubtopic.id})

  Topic Summary:
    - Topic: ${topic.title}
    - Subject: ${topic.subject}

  Complete Topic Structure:
  ${topicStructure}

  Parent Subtopic Information:
    - Title: ${parentSubtopic.title}

  Sibling subtopics for the current parent:
  ${siblingSubtopics.map((title, index) => `${index + 1}. ${title}`).join('\n')}

  The suggested subtopics should:
  - Be relevant to the parent subtopic "${parentSubtopic.title}"
  - Have clear, concise descriptions that explain what the user would learn in each subtopic
  - Be distinct from each other and cover different aspects of the parent topic
  - NOT duplicate ANY of the existing subtopics in the entire topic structure
  - Consider the complete topic structure to ensure the suggestions fit logically within the overall learning path
  - Fill knowledge gaps that are not covered by existing subtopics
  - Be designed to expand the knowledge on the parent topic in a meaningful way

  Create an array of 3 suggestion objects with the following structure:
  [
    {
      "title": "Suggested Subtopic Title 1",
      "description": "Brief description of what this subtopic would cover (1-2 sentences)"
    },
    {
      "title": "Suggested Subtopic Title 2",
      "description": "Brief description of what this subtopic would cover (1-2 sentences)"
    },
    {
      "title": "Suggested Subtopic Title 3",
      "description": "Brief description of what this subtopic would cover (1-2 sentences)"
    }
  ]

  ${jsonFormatPrompt}
  `;
}

export function generateSubtopicPrompt(
  topic: Topic,
  topicStructure: string,
  parentSubtopic: Subtopic,
  siblingSubtopics: string[],
  customPrompt?: string,
): string {
  return `
  Generate a new subtopic for the parent subtopic: "${parentSubtopic.title}" (ID: ${parentSubtopic.id})

  Topic Summary:
    - Topic: ${topic.title}
    - Subject: ${topic.subject}

  Complete Topic Structure:
  ${topicStructure}

  Parent Subtopic Information:
    - Title: ${parentSubtopic.title}

  Sibling subtopics for the current parent:
  ${siblingSubtopics.map((title, index) => `${index + 1}. ${title}`).join('\n')}

  ${customPrompt ? `User's custom prompt for this subtopic:
  ${customPrompt}

  IMPORTANT: Use the user's custom prompt to guide the creation of this subtopic, but ensure it still fits within the overall topic structure.` : ''}

  The new subtopic should:
  - Be relevant to the parent subtopic "${parentSubtopic.title}"
  - Have a clear, concise title that describes a specific aspect or concept within the parent subtopic
  - IMPORTANT: Keep the title short - maximum 3 words
  - NOT duplicate ANY of the existing subtopics in the entire topic structure
  - Consider the complete topic structure to ensure the new subtopic fits logically within the overall learning path
  - Fill knowledge gaps that are not covered by existing subtopics
  - Have a unique ID that follows the pattern: "${parentSubtopic.id}-child-number"
  - Be designed to expand the knowledge on the parent topic in a meaningful way
  - Include a concise summary of not more than 144 characters that describes the content and purpose of this subtopic
  - IMPORTANT: Determine an appropriate "order" value that represents where this subtopic should be learned in relation to its siblings
    - You can insert this subtopic at any position by assigning an appropriate order number
    - Consider the content of the subtopic and its relationship to existing siblings when determining its position
    - The order should reflect a logical learning progression, with foundational concepts having lower order numbers
    - You have full control over where to position this subtopic in the learning sequence

  Create a new subtopic with the following structure:
  {
    "id": "Generated unique ID",
    "title": "New Subtopic Title",
    "order": 1, // Order in which this should be learned relative to its siblings
    "summary": "Concise summary of the subtopic content and purpose (max 144 characters)"
  }

  ${jsonFormatPrompt}
  `;
}
