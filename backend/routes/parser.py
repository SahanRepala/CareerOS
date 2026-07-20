from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from parsing.extractors import extract_resume_data, extract_jd_data
from pydantic import BaseModel

router = APIRouter()

class ResumeParsingResponse(BaseModel):
    data: dict

@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Unsupported file format.")
    
    try:
        content = await file.read()
        parsed_data = extract_resume_data(content, file.filename)
        return {"data": parsed_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing failed: {str(e)}")

@router.post("/parse-jd")
async def parse_jd(
    text: str = Form(None),
    file: UploadFile = File(None)
):
    if not text and not file:
        raise HTTPException(status_code=400, detail="Provide either text or file.")
    
    try:
        if file:
            if not file.filename.endswith(('.pdf', '.txt')):
                raise HTTPException(status_code=400, detail="Unsupported file format.")
            content = await file.read()
            parsed_data = extract_jd_data(content, file.filename)
        else:
            parsed_data = extract_jd_data(text.encode(), "manual_paste.txt")
        return {"data": parsed_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing failed: {str(e)}")
