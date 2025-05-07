from google.adk.agents import Agent
from .game_ideas import game_ideas

def get_gameplay_ideas() -> list[str]:
    """Returns a list of possible gameplay ideas. This can be taken as inspiration!

    Returns:
        list of gameplay ideas
    """
    return game_ideas


edu_game_developer = Agent(
    name="edu_game_developer",
    model="gemini-2.5-pro-preview-05-06",
    description="Writes indy games in HTML which help to learn and memorize the material.",
    instruction=(
        """
        You are professional game developer agent. 
        You develop indy games that help humans learn and memorize the material of some topic.
        Users sends you a description of the game and the material to learn.
        The game should have score which represents the level of how the user learned the material. The score should be between 0 and 100.
        Each game should start with a screen which contains a short game description, rules, start button and the goal: reach score 100.
        You should use tool `get_gameplay_ideas` ask for game ideas. The result game should be based on the combination of user input, game idea and the material.
        You write the game in HTML and your output is a single HTML file.
        RETURN ONLY HTML CODE, don't add any extra information, don't put into markdown code quotes.
        """
    ),
    tools=[get_gameplay_ideas],
)