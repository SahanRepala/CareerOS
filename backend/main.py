from fastapi import FastAPI
from routes.parser import router as parser_router
from routes.ats import router as ats_router
from routes.interview import router as interview_router
from routes.learning import router as learning_router

app = FastAPI(title="CareerOS Resume Parser API")

app.include_router(parser_router, prefix="/api")
app.include_router(ats_router, prefix="/api")
app.include_router(interview_router, prefix="/api/interview")
app.include_router(learning_router, prefix="/api/learning")

@app.get("/health")
def health():
    return {"status": "ok"}
