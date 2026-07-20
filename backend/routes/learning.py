from fastapi import APIRouter, HTTPException
from learning_engine.generator import generate_learning_roadmap
from pydantic import BaseModel

router = APIRouter()

class GenerateRoadmapRequest(BaseModel):
    user_id: str
    resume: dict
    jd: dict
    ats_report: dict
    optimized_resume: dict

@router.post("/generate")
async def generate(request: GenerateRoadmapRequest):
    try:
        roadmap = generate_learning_roadmap(
            request.resume, 
            request.jd, 
            request.ats_report, 
            request.optimized_resume
        )
        return {"data": roadmap}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
