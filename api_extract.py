from flask import Flask, request, jsonify
from flask_cors import CORS
from resume_nlp import extract_profile

app = Flask(__name__)
CORS(app)  # allow requests from localhost:3000

@app.get("/")
def home():
    return "✅ DEET Demo API running. Use POST /extract", 200

@app.post("/extract")
def extract():
    data = request.get_json(force=True) or {}
    text = data.get("text", "")
    return jsonify(extract_profile(text))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)