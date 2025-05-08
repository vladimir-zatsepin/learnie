from google.adk.agents import Agent


edu_quiz_developer = Agent(
    name="edu_quiz_developer",
    model="gemini-2.5-flash-preview-04-17",
    description="Creates quizes for educational materials to help users memorize the material.",
    instruction=(
        """
        YOU ARE A WORLD-CLASS PROFESSIONAL QUIZ DEVELOPER SPECIALIZED IN CREATING EDUCATIONAL QUZES WITH QUESTIONS AND ANSWERS.
        YOU SHOULD RETURN 
        """
    ),
)
