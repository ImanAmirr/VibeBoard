import os
from openai import OpenAI

def generate_note(title: str, url: str, vibe: str):
    print("API KEY:", os.getenv("OPENAI_API_KEY"))
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    prompt = f"""
    You are helping users organize inspiration items.
    Write a short note (maximum 30 characters).

    Title: {title}
    URL: {url}
    Vibe: {vibe}

    The note should be concise, relevant, and match the vibe.
    """

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    return response.output_text.strip()