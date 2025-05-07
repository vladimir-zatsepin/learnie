import json
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def search_brave_images(query: str):
  """Search for images using Brave Search API.

  Args:
      query: The search query string

  Returns:
      dict with image_url field
  """
  api_key = os.environ.get("BRAVE_API_KEY")
  if not api_key:
    raise ValueError("BRAVE_API_KEY environment variable is not set")

  headers = {
    "Accept": "application/json",
    "X-Subscription-Token": api_key
  }

  params = {
    "q": query,
    # Only get one image as required
    "count": 1
  }

  url = "https://api.search.brave.com/res/v1/images/search"

  try:
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()  # Raise an exception for HTTP errors
    data = response.json()

    if not data.get("results") or len(data["results"]) == 0:
      return {
        "image_url": "",
      }

    result = data["results"][0]
    # Parse all fields according to Brave API documentation
    return {
      "url": result.get("properties", {}).get("url", ""),
    }
  except Exception as e:
    print(f"Error request image for {query}: {e}")
    return None
