import os

from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

from utils import extract_text, clean_text


app = Flask(__name__)

# Configure and create the uploads directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def health_check():
    """Simple health check endpoint."""
    return "Backend is running"


@app.post("/upload")
def upload_resume():
    """
    Accept a resume file upload and return extracted plain text.
    Expects multipart/form-data with a "file" field.
    """
    uploaded_file = request.files.get("file")

    if uploaded_file is None:
        return (
            jsonify(
                {
                    "success": False,
                    "data": None,
                    "error": "No file part in the request. Expected field name 'file'.",
                }
            ),
            400,
        )

    if uploaded_file.filename is None or uploaded_file.filename.strip() == "":
        return (
            jsonify(
                {
                    "success": False,
                    "data": None,
                    "error": "No file selected for upload.",
                }
            ),
            400,
        )

    # Use a secure version of the filename to avoid filesystem issues
    filename = secure_filename(uploaded_file.filename)

    if filename == "":
        return (
            jsonify(
                {
                    "success": False,
                    "data": None,
                    "error": "Invalid file name.",
                }
            ),
            400,
        )

    # Determine file extension safely
    _, ext = os.path.splitext(filename)
    extension = ext.lower().lstrip(".")

    # Save the uploaded file to the uploads directory
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    uploaded_file.save(filepath)

    # Extract and clean text using utility functions
    raw_text = extract_text(filepath, extension)
    cleaned_text = clean_text(raw_text)

    if not cleaned_text:
        return (
            jsonify(
                {
                    "success": False,
                    "data": None,
                    "error": "Could not extract text from uploaded file. "
                    "The format may be unsupported or the file may be empty.",
                }
            ),
            422,
        )

    return jsonify(
        {
            "success": True,
            "data": {
                "raw_text": cleaned_text,
            },
            "error": None,
        }
    )


if __name__ == "__main__":
    # Ensure Windows console can print the rocket emoji reliably
    try:
        import sys

        if hasattr(sys.stdout, "reconfigure"):
            sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    print("🚀 Starting Flask server...")
    app.run(host="127.0.0.1", port=5000, debug=True)

