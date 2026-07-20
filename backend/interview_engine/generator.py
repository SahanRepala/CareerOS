from openai import OpenAI
import os
import hashlib
import json

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_interview_questions(resume, jd, ats_report):
    # Deterministic Cache Key
    cache_key = hashlib.sha256(json.dumps([resume, jd, ats_report], sort_keys=True).encode()).hexdigest()
    
    # 1. Check cache (simplified - in production use Redis)
    
    # 2. Build Prompt
    prompt = f"Generate 10 personalized interview questions for..."
    
    # 3. Call OpenAI
    # ...
    
    return []
