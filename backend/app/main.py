from fastapi import FastAPI
from app.metrics import get_metrics

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Homelab Monitor API is running"}

@app.get("/metrics")
def metrics():
    return get_metrics()