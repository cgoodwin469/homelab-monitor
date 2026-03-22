from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.metrics import get_metrics
from app.database import get_history, start_logging

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    start_logging()

@app.get("/")
def root():
    return {"message": "Homelab Monitor API is running"}

@app.get("/metrics")
def metrics():
    return get_metrics()

@app.get("/metrics/history")
def metrics_history():
    return get_history()
