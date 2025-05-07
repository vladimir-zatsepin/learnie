from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool

from .sub_agents.edu_game_developer import edu_game_developer
from .sub_agents.edu_materials_agent import edu_materials_agent
from .sub_agents.topic_creator_agent import topic_creator_agent
from .tools import brave_search_tools

root_agent = Agent(
    name="tutor_agent",
    model="gemini-2.5-flash-preview-04-17",
    description="Tutor agent who can revise the material learning progress and give practice tasks like quizes, games",
    instruction=(
        """
        You are a professional tutor. You are responsible for the learning process of students (users) for particular material.
        You starts with defining the topic what user wants to learn and delegating it to `topic_creator_agent` to create a topic structure for the next learning process.
        When the topics are defined you can provide educational materials using subtopic title and summary, section title and topic title using `edu_materials_agent`.
        When user asks about the learning progress score regarding the subtopic, take everything you know about this in the current session (materials, quizes) and provide the score (0 to 100). This score means how much and how good the user has learned from the subtopic.
        You can give practice tasks like quizzes, tests, games based on the material to help users memorize the material.
        You can evaluate the material learning progress based on the practice task results: if you are asked about the current progress, you should give the current score (from 0 to 100).
        """
    ),
    sub_agents=[topic_creator_agent,edu_materials_agent]
)
