from . import keywords, skills, sections, recommendations

def analyze(resume, jd):
    # Deterministic ATS Analysis Logic
    keyword_score = keywords.match(resume, jd)
    skill_score = skills.compare(resume, jd)
    section_score = sections.analyze(resume)
    
    # ... compile all into JSON
    overall_score = (keyword_score + skill_score + section_score) / 3
    
    return {
        "score": round(overall_score, 2),
        "details": {
            "keywords": keywords.get_details(resume, jd),
            "skills": skills.get_details(resume, jd),
            "sections": sections.get_details(resume),
            "recommendations": recommendations.generate(resume, jd)
        }
    }
