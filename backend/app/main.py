from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.metrics import get_metrics

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Homelab Monitor API is running"}

@app.get("/metrics")
def metrics():
    return get_metrics()