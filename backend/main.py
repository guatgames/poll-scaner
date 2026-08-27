from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List
import uvicorn

from scanner import scanner_service

app = FastAPI(title="Kinal Survey Scanner API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base de datos en memoria para almacenamiento del proyecto
SURVEY_DATABASE: List[Dict[str, str]] = []

class SurveySubmission(BaseModel):
    q1: str
    q2: str
    q3: str
    q4: str
    q5: str

@app.post("/api/scan")
async def scan_survey(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen validada.")
    
    contents = await file.read()
    result = scanner_service.process_image(contents)
    return result

@app.post("/api/surveys/save")
async def save_survey(submission: SurveySubmission):
    data = submission.dict()
    SURVEY_DATABASE.append(data)
    return {"message": "Encuesta guardada con éxito", "total": len(SURVEY_DATABASE)}

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    total = len(SURVEY_DATABASE)
    
    # Estructura inicial de conteos
    stats = {
        "total_scanned": total,
        "q1": {"A": 0, "B": 0, "C": 0},
        "q2": {"A": 0, "B": 0, "C": 0, "D": 0},
        "q3": {"A": 0, "B": 0, "C": 0, "D": 0},
        "q4": {"A": 0, "B": 0, "C": 0, "D": 0},
        "q5": {"A": 0, "B": 0, "C": 0, "D": 0},
    }

    for survey in SURVEY_DATABASE:
        for q_key in ["q1", "q2", "q3", "q4", "q5"]:
            ans = survey.get(q_key)
            if ans in stats[q_key]:
                stats[q_key][ans] += 1

    return stats

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)