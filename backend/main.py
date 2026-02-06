from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import ai_service

app = FastAPI(title="AI Code Analyzer")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. In production, be specific.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    history: List[dict]
    question: str
    code_context: str

@app.get("/")
def read_root():
    return {"message": "AI Code Analyzer API is running"}

@app.post("/analyze")
async def analyze_code_endpoint(
    file: Optional[UploadFile] = File(None),
    code_text: Optional[str] = Form(None)
):
    content = ""
    filename = "snippet"

    if file:
        content_bytes = await file.read()
        try:
            content = content_bytes.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="File must be a text file (UTF-8).")
        filename = file.filename
    elif code_text:
        content = code_text
    else:
        raise HTTPException(status_code=400, detail="Either file or code_text must be provided.")

    if not content.strip():
        raise HTTPException(status_code=400, detail="Code content is empty.")

    # Call AI service
    result_json_str = await ai_service.analyze_code(content, filename)
    
    try:
        result_data = json.loads(result_json_str)
        return result_data
    except json.JSONDecodeError:
        # Fallback if AI returns valid text but invalid JSON
        return {
            "summary": "Analysis completed but format was raw.",
            "explanation": result_json_str,
            "quality_analysis": {"complexity": "Unknown", "readability_score": "N/A", "suggestions": []},
            "key_components": []
        }

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    response_text = await ai_service.chat_about_code(
        request.history, 
        request.question, 
        request.code_context
    )
    return {"response": response_text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
