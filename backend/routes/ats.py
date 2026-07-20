from fastapi import APIRouter, HTTPException
from ats_engine.engine import analyze
from ats_engine.optimizer import optimize_resume
from pdf_generator.engine import generate_pdf
from pydantic import BaseModel

router = APIRouter()

class AtsAnalysisRequest(BaseModel):
    resume: dict
    jd: dict

class OptimizerRequest(BaseModel):
    resume: dict
    jd: dict
    ats_report: dict

class PdfGenerationRequest(BaseModel):
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
        # Note: In production, upload to Supabase and return URL.
        return {"data": "PDF generated"} 
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
