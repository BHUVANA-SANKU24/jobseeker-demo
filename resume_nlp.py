# resume_nlp.py
from __future__ import annotations

import re
from typing import Dict, List, Tuple

# Optional spaCy (safe fallback if not installed)
try:
    import spacy  # type: ignore
    _NLP = spacy.load("en_core_web_sm")
except Exception:
    _NLP = None


# -----------------------------
# Regex + Dictionaries
# -----------------------------
EMAIL_RE = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I)

# Loose phone regex; validate by digit count later
PHONE_RE = re.compile(r"(\+?\d[\d\s().-]{7,}\d)")

DEGREE_KEYWORDS = [
    "b.tech", "btech", "b.e", "be", "b.sc", "bsc", "bca",
    "mba", "m.tech", "mtech", "m.sc", "msc", "mca",
    "phd", "diploma", "intermediate", "ssc", "b.com", "bcom",
    "m.com", "mcom", "bba", "ba", "ma",
    "bachelor of technology", "bachelor of engineering", "master of technology"
]

BRANCH_KEYWORDS = [
    "computer science", "cse", "information technology", "it",
    "ece", "eee", "mechanical", "civil",
    "ai", "artificial intelligence",
    "data science", "machine learning", "electronics"
]

# Expand this list as you test with real resumes
SKILL_CANONICAL = {
    # programming
    "python": "Python",
    "sql": "SQL",
    "mysql": "MySQL",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "java": "Java",
    "c++": "C++",
    "c#": "C#",
    "c": "C",
    "javascript": "JavaScript",
    "js": "JavaScript",
    "typescript": "TypeScript",
    "html": "HTML",
    "css": "CSS",
    "php": "PHP",

    # frameworks
    "django": "Django",
    "react": "React",
    "next.js": "Next.js",
    "nextjs": "Next.js",
    "mern": "MERN Stack",

    # DE stack
    "spark": "Apache Spark",
    "pyspark": "PySpark",
    "databricks": "Databricks",
    "delta": "Delta Lake",
    "delta lake": "Delta Lake",
    "airflow": "Airflow",
    "dbt": "dbt",
    "kafka": "Kafka",

    # DS/ML
    "tensorflow": "TensorFlow",
    "scikit-learn": "Scikit-learn",
    "sklearn": "Scikit-learn",
    "opencv": "OpenCV",
    "mediapipe": "MediaPipe",

    # cloud
    "azure": "Azure",
    "adf": "Azure Data Factory",
    "azure data factory": "Azure Data Factory",
    "synapse": "Azure Synapse",
    "aws": "AWS",
    "gcp": "GCP",

    # tools
    "git": "Git",
    "docker": "Docker",
    "linux": "Linux",
    "excel": "Excel",
}

SECTION_HEADERS = [
    "skills", "technical skills", "skills summary",
    "education",
    "experience", "work experience", "professional experience",
    "projects",
    "summary", "profile", "objective",
    "certifications", "certificates",
]


# -----------------------------
# Helpers
# -----------------------------
def normalize_text(text: str) -> str:
    text = text.replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    # fix hyphen line breaks: "engi-\nneer" -> "engineer"
    text = re.sub(r"(\w)-\n(\w)", r"\1\2", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _digits_only(s: str) -> str:
    return re.sub(r"\D", "", s)


def find_email(text: str) -> Tuple[str, float]:
    m = EMAIL_RE.search(text)
    if not m:
        return "", 0.0
    return m.group(0), 0.98


def find_phone(text: str) -> Tuple[str, float]:
    # normalize odd formats like "91+ 784274592" -> "+91 784274592"
    text = re.sub(r"\b(\d{1,3})\+\s*", r"+\1 ", text)

    candidates = PHONE_RE.findall(text)
    best = ""
    best_len = 0

    for c in candidates:
        digits = _digits_only(c)
        # accept 9-13 digits (covers cases like missing one digit in fake data too)
        if 9 <= len(digits) <= 13:
            if len(digits) > best_len:
                best = c.strip()
                best_len = len(digits)

    if not best:
        return "", 0.0

    conf = 0.92 if best_len in (10, 12, 13) else 0.85
    return best, conf


def split_sections(text: str) -> Dict[str, str]:
    """
    Simple section splitter using known headers.
    Returns: header -> content. Includes "__top__".
    """
    lines = [ln.strip() for ln in text.split("\n")]
    sections: Dict[str, List[str]] = {"__top__": []}
    current = "__top__"

    header_re = re.compile(r"^[A-Za-z][A-Za-z &/]{2,40}$")

    header_map = {
        "work experience": "experience",
        "professional experience": "experience",
        "skills summary": "skills",
        "technical skills": "skills",
        "certificates": "certifications",
    }

    def canon(h: str) -> str:
        h = h.lower().strip(":").strip()
        return header_map.get(h, h)

    known = set([canon(h) for h in SECTION_HEADERS])

    for ln in lines:
        if not ln:
            continue

        low = canon(ln)
        if header_re.match(ln) and low in known:
            current = low
            sections.setdefault(current, [])
            continue

        sections.setdefault(current, []).append(ln)

    return {k: "\n".join(v).strip() for k, v in sections.items()}


# -----------------------------
# NEW: Skills cleaning filter (prevents junk in Resume 3 & 5)
# -----------------------------
def clean_skill(token: str) -> bool:
    token = token.strip()
    if not token:
        return False

    low = token.lower()

    # ❌ reject pure numbers
    if token.isdigit():
        return False

    # ❌ reject years
    if re.search(r"\b(19|20)\d{2}\b", token):
        return False

    # ❌ reject labels
    if ":" in token:
        return False

    # ❌ reject long phrases
    if len(token.split()) > 4:
        return False

    # ❌ reject generic non-skill words
    reject_exact = {
        "learning",
        "self learning",
        "self-learning",
        "teamwork",
        "communication",
        "leadership"
    }
    if low in reject_exact:
        return False

    # ❌ reject non-skill academic / activity phrases
    reject_contains = [
        "relevant coursework",
        "secondary school",
        "secured",
        "award",
        "board examinations",
        "current gpa",
        "education",
        "about me",
        "discipline",
        "punctuality",
        "anchoring",
        "school",
        "college",
        "institute",
        "cloud platform"   # removes "AWS Cloud Platform"
    ]
    if any(p in low for p in reject_contains):
        return False

    # ❌ reject combined phrases like "Git & GitHub"
    if "&" in token:
        return False

    # ❌ remove likely names unless known tech phrase
    if re.fullmatch(r"[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+", token):
        allowed = {
            "Machine Learning",
            "Artificial Intelligence",
            "Data Science",
            "Statistics for Data Science"
        }
        if token not in allowed:
            return False

    return True


def extract_skills(text: str, sections: Dict[str, str]) -> Tuple[List[str], float]:
    raw = sections.get("skills", "")
    haystack = (raw if raw else text).lower()

    found = set()

    # 1) If skills section exists, parse tokens aggressively (demo-friendly)
    if raw:
        tokens = re.split(r"[,\n•|/]+", raw)
        for t in tokens:
            tt = t.strip()

            tt = re.sub(r"[()]+", "", tt).strip()     # remove brackets: "(Basic)" -> "Basic"
            tt = tt.replace(".js", "").strip()        # "React.js" -> "React"

            if not clean_skill(tt):
                continue

            # normalize if known, else keep as-is
            key = tt.lower()
            if key in SKILL_CANONICAL:
                found.add(SKILL_CANONICAL[key])
            else:
                found.add(tt)

    # 2) Also scan whole text for canonical keywords
    for k, canon in SKILL_CANONICAL.items():
        if re.search(rf"(?<!\w){re.escape(k)}(?!\w)", haystack):
            found.add(canon)

    skills = sorted(found)
    if not skills:
        return [], 0.0
    return skills, (0.85 if raw else 0.65)


def extract_education(text: str, sections: Dict[str, str]) -> Tuple[Dict[str, str], float]:
    edu = sections.get("education", "")
    hay = (edu if edu else text).lower()

    degree = ""
    for d in DEGREE_KEYWORDS:
        if re.search(rf"(?<!\w){re.escape(d)}(?!\w)", hay):
            # normalize a bit
            if "bachelor" in d:
                degree = "BTECH"
            elif "master" in d:
                degree = "MTECH"
            else:
                degree = d.upper().replace(".", "")
            break

    branch = ""
    for b in BRANCH_KEYWORDS:
        if re.search(rf"(?<!\w){re.escape(b)}(?!\w)", hay):
            branch = b.upper()
            break

    institute = ""
    if edu:
        m = re.search(r"(?:university|college|institute|iit|nit)\b[^\n,]{0,80}", edu, re.I)
        if m:
            institute = m.group(0).strip()

    if not (degree or branch or institute):
        return {"highest_qualification": "", "branch_or_major": "", "institute": ""}, 0.0

    conf = 0.8 if edu else 0.6
    return {
        "highest_qualification": degree,
        "branch_or_major": branch,
        "institute": institute
    }, conf


def extract_employment(text: str, sections: Dict[str, str]) -> Tuple[Dict[str, str], float]:
    """
    Hackathon-friendly logic:
    - If explicit years/months -> Experienced with high confidence.
    - If internship/student/member/virtual internship -> Fresher with high confidence.
    - If experience section exists but no years -> Experienced with medium confidence.
    - Otherwise default Fresher.
    """
    exp_section = sections.get("experience", "")
    hay = (exp_section + "\n" + sections.get("__top__", "")).lower()

    years = ""
    ym = re.search(r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years|year|yrs|yr)\b", hay)
    if ym:
        years = ym.group(1)

    if not years:
        mm = re.search(r"(\d+)\s*(?:months|month)\b", hay)
        if mm:
            months = int(mm.group(1))
            years = str(round(months / 12, 1))

    fresher_signals = ["fresher", "entry level", "recent graduate", "student"]
    internship_signals = ["intern", "internship", "virtual internship", "trainee", "apprentice", "member", "club"]

    has_fresher = any(s in hay for s in fresher_signals)
    has_intern = any(s in hay for s in internship_signals)

    if years:
        return {"status": "Experienced", "years_experience": years}, 0.90

    if has_fresher or has_intern:
        return {"status": "Fresher", "years_experience": ""}, 0.80

    if exp_section.strip():
        return {"status": "Experienced", "years_experience": ""}, 0.65

    return {"status": "Fresher", "years_experience": ""}, 0.75


def extract_name(text: str, sections: Dict[str, str]) -> Tuple[str, float]:
    """
    Best-effort:
    - Check first ~8 lines in __top__ for name-like text
    - Else spaCy PERSON entity
    """
    top_lines = sections.get("__top__", "").split("\n")[:8]
    ignore_words = ("linkedin", "github", "portfolio", "resume", "email", "phone", "www")

    for ln in top_lines:
        cand = ln.strip()
        if not cand:
            continue
        low = cand.lower()
        if any(w in low for w in ignore_words):
            continue
        if "@" in cand or any(ch.isdigit() for ch in cand):
            continue
        if 2 <= len(cand.split()) <= 5 and re.fullmatch(r"[A-Za-z .'-]+", cand):
            return cand, 0.70

    if _NLP:
        doc = _NLP("\n".join(top_lines))
        persons = [ent.text.strip() for ent in doc.ents if ent.label_ == "PERSON"]
        if persons:
            return persons[0], 0.55

    return "", 0.0


def build_warnings(profile: Dict) -> List[str]:
    warnings: List[str] = []

    # Empty checks (always)
    if not profile["personal"]["full_name"]:
        warnings.append("Full name not found — please enter manually.")
    if not profile["personal"]["email"]:
        warnings.append("Email not found — please verify/enter.")
    if not profile["personal"]["phone"]:
        warnings.append("Phone not found — please verify/enter.")
    if not profile["skills"]:
        warnings.append("Skills not detected — add skills manually.")

    edu = profile["education"]
    if not (edu["highest_qualification"] or edu["branch_or_major"] or edu["institute"]):
        warnings.append("Education not detected — please fill highest qualification.")

    # Low-confidence warnings ONLY for critical personal fields
    conf = profile.get("confidence", {})
    critical_fields = [
        ("full_name", "Low confidence for name — please verify."),
        ("email", "Low confidence for email — please verify."),
        ("phone", "Low confidence for phone — please verify."),
    ]
    for key, msg in critical_fields:
        try:
            if float(conf.get(key, 1.0)) < 0.5:
                warnings.append(msg)
        except Exception:
            pass

    # Employment warning only when ambiguous: Experienced but no years and low-ish confidence
    emp = profile.get("employment", {})
    emp_conf = float(conf.get("employment", 1.0))
    if emp.get("status") == "Experienced" and not emp.get("years_experience") and emp_conf < 0.7:
        warnings.append("Employment looks experienced but years not detected — please verify.")

    # De-duplicate while keeping order
    seen = set()
    out = []
    for w in warnings:
        if w not in seen:
            out.append(w)
            seen.add(w)
    return out


# -----------------------------
# Public API
# -----------------------------
def extract_profile(resume_text: str) -> Dict:
    """
    Input: raw resume text (already OCR'ed or extracted from PDF)
    Output: stable JSON for DEET-style auto-fill
    """
    text = normalize_text(resume_text)
    sections = split_sections(text)

    email, c_email = find_email(text)
    phone, c_phone = find_phone(text)
    skills, c_skills = extract_skills(text, sections)
    education, c_edu = extract_education(text, sections)
    employment, c_emp = extract_employment(text, sections)
    name, c_name = extract_name(text, sections)

    profile = {
        "personal": {
            "full_name": name,
            "email": email,
            "phone": phone,
        },
        "education": education,
        "employment": employment,
        "skills": skills,
        "confidence": {
            "full_name": round(c_name, 2),
            "email": round(c_email, 2),
            "phone": round(c_phone, 2),
            "education": round(c_edu, 2),
            "skills": round(c_skills, 2),
            "employment": round(c_emp, 2),
        },
        "warnings": []
    }

    # warnings
    profile["warnings"] = build_warnings(profile)

    # ✅ NEW: copy-ready text (for UI "Copy to Official Portal" button)
    profile["profile_text"] = (
        f"Full Name: {profile['personal']['full_name']}\n"
        f"Email: {profile['personal']['email']}\n"
        f"Phone: {profile['personal']['phone']}\n"
        f"Highest Qualification: {profile['education']['highest_qualification']}\n"
        f"Branch/Major: {profile['education']['branch_or_major']}\n"
        f"Institute: {profile['education']['institute']}\n"
        f"Employment: {profile['employment']['status']} {profile['employment']['years_experience']}\n"
        f"Skills: {', '.join(profile['skills'])}\n"
    )

    return profile