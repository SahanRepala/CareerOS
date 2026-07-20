from fastapi import FastAPI
from routes.parser import router as parser_router
from routes.ats import router as ats_router

app = FastAPI(title="CareerOS Resume Parser API")

app.include_router(parser_router, prefix="/api")
app.include_router(ats_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}
