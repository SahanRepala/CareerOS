from openai import OpenAI
import os
import hashlib
import json

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_learning_roadmap(resume, jd, ats_report, optimized_resume):
    # Cache key based on input content
    cache_key = hashlib.sha256(json.dumps([resume, jd, ats_report, optimized_resume], sort_keys=True).encode()).hexdigest()
    
    # ... logic for prompt building and OpenAI API call ...
    
    return {
        "title": "Roadmap Title",
        "milestones": [
            {
                "week": 1,
                "title": "Milestone 1",
                "objectives": ["Obj 1"],
                "resources": ["Res 1"],
                "project": "Project 1"
            }
        ]
    }
