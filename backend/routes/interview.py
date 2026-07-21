from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status
from interview_engine.generator import generate_interview_questions
from pydantic import BaseModel
from db.supabase import supabase
import logging

# Set up basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class GenerateQuestionsRequest(BaseModel):
    user_id: str
    session_id: str
    resume: Dict[str, Any]
    jd: Dict[str, Any]
    ats_report: Dict[str, Any]

@router.post("/generate")
async def generate(request: GenerateQuestionsRequest):
    try:
        questions = generate_interview_questions(request.resume, request.jd, request.ats_report)
        
        # NOTE: Missing DB insertion logic in original - assuming it's meant to be added 
        # or that generation is enough. Will add placeholder log for DB insertion.
        logger.info(f"Generated {len(questions)} questions for session {request.session_id}")
        
        return {"data": questions}
    except Exception as e:
        logger.error(f"Interview generation failed for session {request.session_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Interview question generation failed."
        )
