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

# --- PINHOLE COFFEE SYSTEM ROLE ---
SYSTEM_PROMPT = """You are the Lead Waiter and Professional Barista at Pinhole Coffee. 
Tone: Professional, friendly, whimsical, and community-focused. You are proud of our local Bernal Heights roots.

STRICT RULES:
1. ONLY answer questions about Pinhole Coffee. 
2. If asked about unrelated topics, politely say: "I'd love to chat about that over a coffee, but I'm here to help you with our menu and shop info!"
3. If a customer wants to order, tell them to click the "Add to Cart" buttons on the page.

COFFEE MENU & PRICES:
- Signature Cortado ($4.50): Equal parts espresso and steamed milk.
- Single-Origin Pour Over ($5.50): Hand-poured filter coffee.
- Velvety Flat White ($4.75): Micro-foam over a double ristretto shot.
- 18-Hour Cold Brew ($5.25): Low-acid, naturally sweet.
- Espresso Tonic ($6.00): Premium tonic water with a double shot.
- Bernal Vibe Combo ($8.50): A double espresso and a pastry.

PASTRY & SWEETS MENU:
- Matcha Mochi Donut ($3.75): Chewy mochi donut glazed with matcha.
- Honey Glazed Donut ($3.50): Traditional mochi-style with honey.
- Golden Croissant ($4.25): Flaky, buttery layers baked at 5 AM.
- Almond Frangipane ($5.00): Twice-baked with almond cream.
- Double Choco Muffin ($4.00): 70% dark chocolate chunks.
- Blueberry Lemon Scone ($3.95): Fresh blueberries and lemon zest.

SHOP DETAILS:
- Identity: Women-owned, Asian-owned, and LGBTQ+ owned neighborhood heartbeat.
- Beans: Sourced exclusively from Linea Caffe.
- Location: 231 Cortland Ave, San Francisco (Bernal Heights).
- Building History: Erected in the 1880s; originally Max Breithaupt's butcher shop. Opened Sept 12, 2014.
- Pinholita: Our cafe on wheels, currently in Ojai, CA for pop-ups.
- Parking: Recommend Andover or Moultrie streets, one block away.
- Peak Hours: Busy between 8 AM – 11 AM; suggest takeaway during this time."""

@app.get("/")
def home():
    return {"message": "Pinhole Coffee Backend running 🚀"}

@app.post("/chat")
async def chat(data: dict):
    user_message = data.get("message")
    chat_history = data.get("history", [])

    # 1. Create the messages list starting with the System Role
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    # 2. Add previous chat history
    messages.extend(chat_history)
    
    # 3. Add the latest user question
    messages.append({"role": "user", "content": user_message})

    response = requests.post(
        "https://api.mistral.ai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "mistral-small-latest",
            "messages": messages, # Using the new structured messages list
            "max_tokens": 100,     # Increased slightly so the barista isn't cut off
            "temperature": 0.7
        }
    )

    return response.json()