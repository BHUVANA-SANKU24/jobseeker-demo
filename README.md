# DEET AI Backend (Demo)

This is a small, demo Python Flask backend that accepts resume uploads and returns the extracted plain text in a JSON response.  
It is designed to be consumed by a separate NLP layer (not included here).

---

## What this backend does

- **Accepts resume files** via `POST /upload` as `multipart/form-data` with a `file` field.
- **Supports formats**: PDF, DOCX, PNG, JPG, JPEG.
- **Extracts text** using:
  - `pdfplumber` for PDF files
  - `python-docx` for DOCX files
  - `Pillow` + `pytesseract` for image files (PNG/JPG/JPEG)
- **Cleans the extracted text** by normalizing whitespace.
- **Returns a JSON response** containing the raw extracted text or an error message.

No database, no authentication, and no NLP logic are included—this is purely a text extraction backend.

---

## Project structure

```text
deet-ai-backend/
├── app.py          # Flask server (routes and HTTP handling only)
├── utils.py        # Resume text extraction and cleaning utilities
├── uploads/        # Created automatically at runtime to store uploaded files
├── requirements.txt
└── README.md
```

---

## Setup and installation

1. **Navigate into the project directory**

```bash
cd "DEET project/deet-ai-backend"
```

2. **Create and activate a virtual environment** (recommended)

```bash
python -m venv .venv
.venv\Scripts\activate  # On Windows PowerShell
```

3. **Install Python dependencies**

```bash
pip install -r requirements.txt
```

4. **Install Tesseract OCR (required for image resumes)**

- This backend uses `pytesseract`, which is a Python wrapper around the Tesseract OCR engine.
- You must install Tesseract **separately** on your system:
  - Windows builds and instructions can be found in the official docs or community installers (e.g., at `https://github.com/tesseract-ocr/tesseract` or trusted mirrors).
- After installation, ensure the Tesseract executable is on your system `PATH` or configure `pytesseract.pytesseract.tesseract_cmd` in `utils.py` if needed.

PDF and DOCX extraction will work without Tesseract; only image files require it.

---

## Running the server

From inside the `deet-ai-backend` directory:

```bash
python app.py
```

You should see:

```text
🚀 Starting Flask server...
 * Serving Flask app 'app'
 * Debug mode: on
```

The server will listen on:

- **Host:** `127.0.0.1`
- **Port:** `5000`

Health check:

```bash
curl http://127.0.0.1:5000/
# -> "Backend is running"
```

---

## Testing the `/upload` endpoint

### Using `curl`

Upload a PDF (similar for DOCX/PNG/JPG/JPEG):

```bash
curl -X POST http://127.0.0.1:5000/upload ^
  -H "Content-Type: multipart/form-data" ^
  -F "file=@C:\path\to\your\resume.pdf"
```

Example success response:

```json
{
  "success": true,
  "data": {
    "raw_text": "Extracted resume text goes here ..."
  },
  "error": null
}
```

Example failure response:

```json
{
  "success": false,
  "data": null,
  "error": "Human readable error message"
}
```

### Using Postman (or similar tools)

1. Set the request method to **POST**.
2. Set the URL to `http://127.0.0.1:5000/upload`.
3. Under **Body**, choose **form-data**.
4. Add a key named `file`:
   - Type: **File**
   - Choose your resume file (PDF/DOCX/PNG/JPG/JPEG).
5. Send the request and inspect the JSON response.

---

## How an NLP layer would consume this backend

1. The NLP service (Person 2) sends a `POST /upload` request with the resume file in the `file` field.
2. The backend responds with the JSON structure:

```json
{
  "success": true,
  "data": {
    "raw_text": "<extracted resume text>"
  },
  "error": null
}
```

3. The NLP layer:
   - Checks `success` is `true`.
   - Reads `data.raw_text`.
   - Applies its own parsing, entity extraction, embedding, or other NLP tasks on that text.

If `success` is `false`, the NLP service can look at the `error` field and decide how to handle the failure (retry, ask for another file, log an error, etc.).

