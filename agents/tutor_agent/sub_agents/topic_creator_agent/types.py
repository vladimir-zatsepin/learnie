from pydantic import BaseModel, Field
from typing import List, Optional

class Subtopic(BaseModel):
    """A subtopic within a section of a topic."""
    title: str = Field(description="The title of the subtopic.")
    summary: Optional[str] = Field(
        default=None,
        description="Short summary up to 500 characters (used only for prompts, not visible to users)."
    )

class Section(BaseModel):
    """A section containing multiple subtopics."""
    title: str = Field(description="The title of the section.")
    subtopics: List[Subtopic] = Field(description="List of subtopics in this section.")
    imageUrl: str = Field(description="URL of the image that describes this section.")

class Topic(BaseModel):
    """A topic containing multiple sections on a given subject."""
    title: str = Field(description="The title of the topic.")
    subject: str = Field(description="The subject area this topic belongs to.")
    sections: List[Section] = Field(description="List of sections included in this topic.")