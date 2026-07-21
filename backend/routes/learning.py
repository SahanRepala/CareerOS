from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status
from learning_engine.generator import generate_learning_roadmap
from pydantic import BaseModel
import logging

# Set up basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class GenerateRoadmapRequest(BaseModel):
    user_id: str
    resume: Dict[str, Any]
    jd: Dict[str, Any]
    ats_report: Dict[str, Any]
    optimized_resume: Dict[str, Any]

@router.post("/generate")
async def generate(request: GenerateRoadmapRequest):
    try:
        roadmap = generate_learning_roadmap(
            request.resume, 
            request.jd, 
            request.ats_report, 
            request.optimized_resume
        )
        logger.info(f"Generated roadmap for user {request.user_id}")
        return {"data": roadmap}
    except Exception as e:
        logger.error(f"Learning roadmap generation failed for user {request.user_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Learning roadmap generation failed."
        )
