from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
import uuid
import logging

# Set up basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# --- Improved Pydantic Models ---

class ResumeContent(BaseModel):
    # Adjust fields based on actual expected structure if known; 
    # using Dict[str, Any] as a transitional step to better validation
    content: Dict[str, Any]

class AtsAnalysisRequest(BaseModel):
    resume: Dict[str, Any] = Field(..., description="The parsed resume data")
    jd: Dict[str, Any] = Field(..., description="The job description data")

class OptimizerRequest(BaseModel):
    resume: Dict[str, Any]
    jd: Dict[str, Any]
    ats_report: Dict[str, Any]

class PdfGenerationRequest(BaseModel):
    user_id: str
    resume_version_id: str
    resume: Dict[str, Any]
    template: str

# --- Endpoints with robust error handling ---

@router.post("/analyze-ats")
async def analyze_ats(request: AtsAnalysisRequest):
    try:
        from ats_engine.engine import analyze
        report = analyze(request.resume, request.jd)
        return {"data": report}
    except Exception as e:
        logger.error(f"ATS Analysis failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Failed to perform ATS analysis."
        )

@router.post("/optimize-resume")
async def optimize_resume_endpoint(request: OptimizerRequest):
    try:
        from ats_engine.optimizer import optimize_resume
        optimized = optimize_resume(request.resume, request.jd, request.ats_report)
        return {"data": optimized}
    except Exception as e:
        logger.error(f"Optimization failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Failed to optimize resume."
        )

@router.post("/generate-pdf")
async def generate_pdf_endpoint(request: PdfGenerationRequest):
    try:
        from pdf_generator.engine import generate_pdf
        from db.supabase import supabase
        
        pdf_content = generate_pdf(request.resume, request.template)
        
        file_path = f"generated_resumes/{uuid.uuid4()}.pdf"
        
        # Upload to Supabase
        upload_res = supabase.storage.from_("resumes").upload(
            path=file_path,
            file=pdf_content,
            file_options={"content-type": "application/pdf"}
        )
        
        if not upload_res:
             raise Exception("Supabase storage upload failed: no response")
        
        # Save metadata to DB
        db_res = supabase.from_("generated_resumes").insert({
            "user_id": request.user_id,
            "resume_version_id": request.resume_version_id,
            "template_name": request.template,
            "file_path": file_path
        }).select("*").single().execute()
        
        if not db_res.data:
            raise Exception("Database insertion failed")

        return {"data": db_res.data} 
    except Exception as e:
        logger.error(f"PDF generation failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="PDF generation failed."
        )
