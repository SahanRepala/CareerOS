from fastapi import APIRouter, HTTPException
from interview_engine.generator import generate_interview_questions
from pydantic import BaseModel
from db.supabase import supabase

router = APIRouter()

class GenerateQuestionsRequest(BaseModel):
    user_id: str
    session_id: str
    resume: dict
    jd: dict
    ats_report: dict

@router.post("/generate")
async def generate(request: GenerateQuestionsRequest):
    try:
        questions = generate_interview_questions(request.resume, request.jd, request.ats_report)
        # Store in DB
        return {"data": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
