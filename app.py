import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS

from utils import extract_text, clean_text
import resume_nlp

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def health_check():
    return "Backend is running"


def read_txt_with_fallbacks(path: str) -> str:
    """Reads a .txt file safely with Windows encoding fallbacks."""
    with open(path, "rb") as f:
        raw = f.read()

    for enc in ("utf-8-sig", "utf-16", "utf-16-le", "utf-16-be", "cp1252", "latin-1"):
        try:
            text = raw.decode(enc)
            if text and text.strip():
                return text
        except Exception:
            continue

    return raw.decode("utf-8", errors="ignore")


def _call_resume_parser(text: str) -> dict:
    """
    Call the resume parser from resume_nlp.py.

    ✅ Preferred: extract_profile(text)
    Falls back to other possible function names.
    """
    candidates = [
        "extract_profile",        # ✅ your current resume_nlp.py uses this
        "parse_resume_text",
        "parse_resume",
        "extract_resume_data",
        "extract_from_text",
        "run",
    ]
    for fn_name in candidates:
        fn = getattr(resume_nlp, fn_name, None)
        if callable(fn):
            return fn(text)

    raise RuntimeError(
        "No parser function found in resume_nlp.py. Expected one of: "
        + ", ".join(candidates)
    )


@app.post("/upload")
def upload_resume():
    uploaded_file = request.files.get("file")

    if uploaded_file is None:
        return jsonify({"success": False, "data": None, "error": "Expected 'file' field."}), 400

    if not uploaded_file.filename or uploaded_file.filename.strip() == "":
        return jsonify({"success": False, "data": None, "error": "No file selected."}), 400

    filename = secure_filename(uploaded_file.filename)
    if not filename:
        return jsonify({"success": False, "data": None, "error": "Invalid file name."}), 400

    _, ext = os.path.splitext(filename)
    extension = ext.lower().lstrip(".")

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    uploaded_file.save(filepath)

    # ✅ FIX: handle TXT separately
    if extension == "txt":
        raw_text = read_txt_with_fallbacks(filepath)
    else:
        raw_text = extract_text(filepath, extension)

    cleaned_text = clean_text(raw_text)

    if not cleaned_text or not cleaned_text.strip():
        return jsonify({
            "success": False,
            "data": None,
            "error": "Could not extract text from uploaded file. The format may be unsupported or the file may be empty."
        }), 422

    # ✅ return raw text
    return jsonify({"success": True, "data": {"raw_text": cleaned_text}, "error": None})


@app.post("/extract")
def extract_structured():
    payload = request.get_json(silent=True) or {}
    text = (payload.get("text") or "").strip()

    if not text:
        return jsonify({"success": False, "data": None, "error": "Missing 'text' in request body"}), 400

    try:
        parsed = _call_resume_parser(text)

        # ✅ Normalize: ALWAYS return {success,data,error}
        return jsonify({"success": True, "data": parsed, "error": None})

    except Exception as e:
        return jsonify({"success": False, "data": None, "error": f"Parser error: {str(e)}"}), 500


if __name__ == "__main__":
    print("🚀 Starting Flask server...")
    app.run(host="127.0.0.1", port=5000, debug=True)