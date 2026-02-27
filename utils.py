import os
import re

import pdfplumber  # For PDF text extraction
from docx import Document  # For DOCX text extraction
from PIL import Image  # For image handling
import pytesseract  # For OCR on images


def extract_pdf_text(file_path: str) -> str:
    if not os.path.exists(file_path):
        return ""

    text_chunks = []
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                if page_text.strip():
                    text_chunks.append(page_text)
    except Exception:
        return ""

    return "\n".join(text_chunks)


def extract_docx_text(file_path: str) -> str:
    if not os.path.exists(file_path):
        return ""

    try:
        document = Document(file_path)
        paragraphs = [para.text for para in document.paragraphs if para.text]
        return "\n".join(paragraphs)
    except Exception:
        return ""


def extract_image_text(file_path: str) -> str:
    if not os.path.exists(file_path):
        return ""

    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        return text or ""
    except Exception:
        return ""


def extract_txt_text(file_path: str) -> str:
    """
    Extract text from a TXT file with encoding fallbacks (Windows-safe).
    """
    if not os.path.exists(file_path):
        return ""

    try:
        with open(file_path, "rb") as f:
            raw = f.read()

        # common encodings in Windows + BOM support
        for enc in ("utf-8-sig", "utf-16", "utf-16-le", "utf-16-be", "cp1252", "latin-1"):
            try:
                text = raw.decode(enc)
                if text and text.strip():
                    return text
            except Exception:
                continue

        return raw.decode("utf-8", errors="ignore")
    except Exception:
        return ""

def clean_text(text: str) -> str:
    """
    Clean extracted text WITHOUT destroying line breaks.
    - Keep '\n' so resume_nlp can detect name/sections.
    - Normalize spaces/tabs inside each line.
    - Collapse too many blank lines.
    """
    if not text:
        return ""

    # Normalize newlines
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Clean each line: collapse spaces/tabs but keep line breaks
    lines = []
    for line in text.split("\n"):
        line = re.sub(r"[ \t]+", " ", line).strip()
        lines.append(line)

    text = "\n".join(lines)

    # Collapse 3+ newlines to max 2 newlines
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()


def extract_text(file_path: str, extension: str) -> str:
    """
    Supported:
      - txt ✅
      - pdf
      - docx
      - png, jpg, jpeg
    """
    if not file_path or not extension:
        return ""

    ext = extension.lower().lstrip(".")

    if ext == "txt":
        return extract_txt_text(file_path)
    if ext == "pdf":
        return extract_pdf_text(file_path)
    if ext == "docx":
        return extract_docx_text(file_path)
    if ext in {"png", "jpg", "jpeg"}:
        return extract_image_text(file_path)

    return ""