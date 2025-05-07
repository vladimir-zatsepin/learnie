from google.adk.agents import Agent
import contextlib
from dotenv import load_dotenv
from ...tools.brave_search_tools import search_brave_images

# Load environment variables from .env file
load_dotenv()


async def create_agent_async():
  """Creates an image search agent with Brave Search API tool."""
  exit_stack = contextlib.AsyncExitStack()

  agent = Agent(
    name="image_searcher_agent",
    model="gemini-2.5-flash-preview-04-17",
    description="Provides images using search query",
    instruction=(
      """
      Use available tools to get image using by search query
      Tools usage rules:
        - Return only one image

      Return result in the following structure according to Brave API documentation:
      {
          "image_url": "Direct URL to the image",
      }

      Only output raw, compact JSON with no formatting, explanation, or markdown. Do not use line breaks or indentation. Just return the JSON object.
      """
    ),
    tools=[search_brave_images],
  )

  return agent, exit_stack


image_search_agent = create_agent_async
