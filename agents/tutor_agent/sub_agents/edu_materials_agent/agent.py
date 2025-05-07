from google.adk.agents import Agent
from .prompt import prompt
from ...tools.brave_search_tools import search_brave_images


edu_materials_agent = Agent(
    name="edu_materials_agent",
    model="gemini-2.5-flash-preview-04-17",
    description="Provides educational materials for subtopic based on the user request, subtopic title and summary, section title and topic title.",
    instruction=prompt,
    tools=[search_brave_images]
)
