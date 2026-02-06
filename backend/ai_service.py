import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=API_KEY)

# Use a model that supports code well
MODEL_NAME = "gemini-2.0-flash-exp"
model = genai.GenerativeModel(MODEL_NAME)

async def analyze_code(code_content: str, filename: str = "uploaded_file"):
    """
    Analyzes the provided code using Gemini to produce a summary, explanation, and quality check.
    """
    prompt = f"""
    You are an expert software engineer and code mentor. 
    Analyze the following source code from a file named "{filename}".
    
    Please provide the output in the following JSON format ONLY (no markdown backticks around the json):
    {{
        "summary": "A brief 2-3 sentence summary of what this code does.",
        "explanation": "A simple, beginner-friendly explanation of the main functions, classes, and logic flow.",
        "quality_analysis": {{
            "complexity": "Low/Medium/High",
            "readability_score": "1-10",
            "suggestions": ["List of specific suggestions to improve the code", "Another suggestion"]
        }},
        "key_components": [
            {{"name": "function_or_class_name", "description": "What it does"}}
        ]
    }}

    Here is the code:
    
    {code_content}
    """

    try:
        response = model.generate_content(prompt)
        # Clean up potential markdown formatting in the response if the model ignores 'no markdown' instruction
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"): # handle generic code block
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return text
    except Exception as e:
        return f'{{"error": "Failed to analyze code: {str(e)}"}}'

async def chat_about_code(history: list, new_question: str, code_context: str):
    """
    Handles a chat question about the code.
    history: list of {"role": "user"|"model", "parts": ["message"]}
    """
    # Create the chat session with context
    # We'll inject the code context into the system prompt or first message for this turn
    
    chat = model.start_chat(history=[])
    
    # Construct a contextual prompt
    context_message = f"""
    Context: The user is asking questions about the following code:
    
    {code_context}
    
    ---
    Chat History:
    {history}
    
    User Question: {new_question}
    
    Answer the user's question simply and clearly, referencing the code where necessary.
    """
    
    try:
        response = chat.send_message(context_message)
        return response.text
    except Exception as e:
        return f"Error getting response: {str(e)}"
