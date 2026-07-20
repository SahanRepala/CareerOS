import io
import fitz  # PyMuPDF
import docx
import spacy

nlp = spacy.load("en_core_web_sm")

def extract_jd_data(content: bytes, filename: str):
    text = ""
    if filename.endswith(".pdf"):
        text = _extract_from_pdf(content)
    elif filename.endswith(".txt") or filename.endswith(".docx"):
        text = content.decode("utf-8", errors="ignore")
    
    # Placeholder extraction for JD
    return {
        "title": "Placeholder Title",
        "company": "Placeholder Company",
        "requirements": ["Skill 1", "Skill 2"],
        "benefits": ["Benefit 1", "Benefit 2"]
    }

def extract_resume_data(content: bytes, filename: str):
    text = ""
    if filename.endswith(".pdf"):
        text = _extract_from_pdf(content)
    elif filename.endswith(".docx"):
        text = _extract_from_docx(content)
    
    # Simple extraction logic to populate the structure
    # This is a placeholder for the actual extraction logic
    return {
        "summary": {"text": "This is a placeholder summary extracted from the text."},
        "education": [],
        "experience": [],
        "projects": [],
        "skills": [],
        "certificates": [],
        "achievements": [],
        "languages": []
    }

def _extract_from_pdf(content: bytes):
    doc = fitz.open(stream=content, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def _extract_from_docx(content: bytes):
    doc = docx.Document(io.BytesIO(content))
    text = "\n".join([para.text for para in doc.paragraphs])
    return text
