from google.adk.agents import Agent
from google.adk.agents.callback_context import CallbackContext
from google.genai.types import GenerateContentConfig

from .prompt import prompt
from .types import Topic
from ..image_search.agent import image_search_agent
from ...tools.brave_search_tools import search_brave_images

topic_creator_agent = Agent(
    name="topic_creator_agent",
    model="gemini-2.5-pro-preview-05-06",
    description='Generates topic structure based on the user request',
    instruction=prompt,
    # output_schema=Topic,
    tools=[search_brave_images],
    # after_agent_callback=
    generate_content_config=GenerateContentConfig( #'error': {'code': 400, 'message': "For controlled generation of only function calls (forced function calling), please set 'tool_config.function_calling_config.mode' field to ANY instead of populating 'response_mime_type' and 'response_schema' fields. For more details, see: https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/function-calling#tool-config
        # response_mime_type="application/json"
        temperature=0.4
    )
)