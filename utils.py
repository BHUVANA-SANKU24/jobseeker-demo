import os
import re

import pdfplumber  # For PDF text extraction
from docx import Document  # For DOCX text extraction
from PIL import Image  # For image handling
import pytesseract  # For OCR on images


def extract_pdf_text(file_path: str) -> str:
    """
    Extract text from a PDF file using pdfplumber.
    Returns an empty string if anything goes wrong.
    """
    if not os.path.exists(file_path):
        return ""

    text_chunks = []

    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                if page_text:
                    text_chunks.append(page_text)
    except Exception:
        # For a beginner-friendly demo, we simply return empty on failure
        return ""

    return "\n".join(text_chunks)


def extract_docx_text(file_path: str) -> str:
    """
    Extract text from a DOCX file using python-docx.
    Returns an empty string if anything goes wrong.
    """
    if not os.path.exists(file_path):
        return ""

    try:
        document = Document(file_path)
        paragraphs = [para.text for para in document.paragraphs if para.text]
        return "\n".join(paragraphs)
    except Exception:
        return ""


def extract_image_text(file_path: str) -> str:
    """
    Extract text from an image file (PNG/JPG/JPEG) using Pillow + pytesseract.
    Returns an empty string if anything goes wrong.
    """
    if not os.path.exists(file_path):
        return ""

    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        return text or ""
    except Exception:
        return ""


def clean_text(text: str) -> str:
    """
    Normalize whitespace in the extracted text.
    - Replace multiple spaces, newlines, and tabs with a single space.
    - Strip leading and trailing whitespace.
    """
    if not text:
        return ""

    # Collapse any sequence of whitespace characters into a single space
    cleaned = re.sub(r"\s+", " ", text)
    return cleaned.strip()


def extract_text(file_path: str, extension: str) -> str:
    """
    Route extraction based on the file extension.
    Supported:
      - pdf
      - docx
      - png, jpg, jpeg
    Returns an empty string for unsupported formats or errors.
    """
    if not file_path or not extension:
        return ""

    ext = extension.lower().lstrip(".")

    if ext == "pdf":
        return extract_pdf_text(file_path)
    if ext == "docx":
        return extract_docx_text(file_path)
    if ext in {"png", "jpg", "jpeg"}:
        return extract_image_text(file_path)

    # Unsupported format
    return ""

