from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
import os

# Load .env variables
load_dotenv()

# Create Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
key = os.getenv("GEMINI_API_KEY")
print("Starts with:", key[:6])
print("Length:", len(key))

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "🚀 AI ChatBot Backend Running"

@app.route("/chat", methods=["POST"])
def chat():
    
    data = request.get_json()

    user_message = data["message"]

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_message
    )

    print("Gemini Response:", response.text)

    return jsonify({
        "reply": response.text
    })

if __name__ == "__main__":
    app.run(debug=True)