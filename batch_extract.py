import json
from pathlib import Path
from resume_nlp import extract_profile

SAMPLES_DIR = Path("samples")
OUT_DIR = Path("outputs")
OUT_DIR.mkdir(exist_ok=True)

def main():
    for p in sorted(SAMPLES_DIR.glob("*.txt")):
        text = p.read_text(encoding="utf-8", errors="ignore")
        result = extract_profile(text)
        out_path = OUT_DIR / f"{p.stem}.json"
        out_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"✅ {p.name} -> {out_path}")

if __name__ == "__main__":
    main()