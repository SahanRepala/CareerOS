from fastapi import APIRouter, HTTPException
from ats_engine.engine import analyze
from ats_engine.optimizer import optimize_resume
from pdf_generator.engine import generate_pdf
from db.supabase import supabase
from pydantic import BaseModel
import uuid

router = APIRouter()

class AtsAnalysisRequest(BaseModel):
    resume: dict
    jd: dict

class OptimizerRequest(BaseModel):
    resume: dict
    jd: dict
    ats_report: dict

class PdfGenerationRequest(BaseModel):
    user_id: str
    resume_version_id: str
    resume: dict
    template: str

@router.post("/analyze-ats")
async def analyze_ats(request: AtsAnalysisRequest):
    try:
        report = analyze(request.resume, request.jd)
        return {"data": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ATS Analysis failed: {str(e)}")

@router.post("/optimize-resume")
async def optimize_resume_endpoint(request: OptimizerRequest):
    try:
        optimized = optimize_resume(request.resume, request.jd, request.ats_report)
        return {"data": optimized}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")

@router.post("/generate-pdf")
async def generate_pdf_endpoint(request: PdfGenerationRequest):
    try:
        pdf_content = generate_pdf(request.resume, request.template)
        
        file_path = f"generated_resumes/{uuid.uuid4()}.pdf"
        
        # Upload to Supabase
        upload_res = supabase.storage.from_("resumes").upload(
            path=file_path,
            file=pdf_content,
            file_options={"content-type": "application/pdf"}
        )
        
        # Save metadata to DB
        db_res = supabase.from_("generated_resumes").insert({
            "user_id": request.user_id,
            "resume_version_id": request.resume_version_id,
            "template_name": request.template,
            "file_path": file_path
        }).select("*").single().execute()
        
        return {"data": db_res.data} 
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
