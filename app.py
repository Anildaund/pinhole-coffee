from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

@app.get("/")
def home():
    return {"message": "Backend running 🚀"}

@app.post("/chat")
async def chat(data: dict):
    user_message = data.get("message")
    chat_history = data.get("history", [])

    response = requests.post(
        "https://api.mistral.ai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "mistral-small-latest",
            "messages": chat_history + [{"role": "user", "content": user_message}],
            "max_tokens": 100,
            "temperature": 0.7
        }
    )

    return response.json()