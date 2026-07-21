from typing import Dict, Any, Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Form, status
from parsing.extractors import extract_resume_data, extract_jd_data
from pydantic import BaseModel
import logging

# Set up basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class ParsingResponse(BaseModel):
    data: Dict[str, Any]

@router.post("/parse-resume", response_model=ParsingResponse)
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename or not file.filename.endswith(('.pdf', '.docx')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Unsupported file format. Only PDF and DOCX allowed."
        )
    
    try:
        content = await file.read()
        parsed_data = extract_resume_data(content, file.filename)
        return {"data": parsed_data}
    except Exception as e:
        logger.error(f"Resume parsing failed for {file.filename}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Resume parsing failed."
        )

@router.post("/parse-jd", response_model=ParsingResponse)
async def parse_jd(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    if not text and not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Provide either text or a file."
        )
    
    try:
        if file:
            if not file.filename or not file.filename.endswith(('.pdf', '.txt')):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail="Unsupported file format. Only PDF and TXT allowed."
                )
            content = await file.read()
            parsed_data = extract_jd_data(content, file.filename)
        else:
            parsed_data = extract_jd_data(text.encode('utf-8'), "manual_paste.txt")
        return {"data": parsed_data}
    except Exception as e:
        logger.error(f"JD parsing failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="JD parsing failed."
        )
