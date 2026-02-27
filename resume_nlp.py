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

    # ✅ NEW: reject separator lines like _________ or ----- or =====
    if re.fullmatch(r"[_=\-]{3,}", token):
        return False

    # ✅ NEW: reject tokens that are mostly underscores/dashes
    if len(token) >= 10 and (_digits_only(token) == "" and token.count("_") / len(token) > 0.6):
        return False

    # ❌ reject pure numbers
    if token.isdigit():
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

            tt = re.sub(r"[_=\-]{3,}", "", tt).strip()
            tt = tt.strip(" ,.;:_-")

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


# -----------------------------
# UPDATED: Education extraction (choose HIGHEST degree reliably)
# -----------------------------
QUAL_RANKS: List[Tuple[str, int, str, str]] = [
    # (label, rank, pattern, normalized_output)
    ("phd", 7, r"\b(ph\.?d|doctorate)\b", "PHD"),
    ("masters", 6, r"\b(m\.?\s*tech|mtech|m\.?\s*e\b|me\b|mba|m\.?\s*sc|msc|mca|masters?)\b", "MASTERS"),
    ("bachelors", 5, r"\b(b\.?\s*tech|btech|b\.?\s*e\b|be\b|b\.?\s*sc|bsc|bca|bcom|b\.?\s*com|bba|ba|bachelors?)\b", "BACHELORS"),
    ("diploma", 4, r"\b(diploma|polytechnic)\b", "DIPLOMA"),
    ("intermediate", 3, r"\b(intermediate|12th|xii|higher\s*secondary|hsc)\b", "INTERMEDIATE"),
    ("ssc", 2, r"\b(ssc|10th|x\b|secondary\s*school)\b", "SSC"),
]

def detect_highest_qualification(hay: str) -> str:
    """
    Picks the highest qualification present in the text.
    Fixes cases where "Intermediate" is found but "B.Tech" also exists.
    """
    best_rank = -1
    best_out = ""
    for _label, rank, pattern, out in QUAL_RANKS:
        if re.search(pattern, hay, flags=re.IGNORECASE):
            if rank > best_rank:
                best_rank = rank
                best_out = out
    return best_out


def extract_education(text: str, sections: Dict[str, str]) -> Tuple[Dict[str, str], float]:
    edu = sections.get("education", "")
    hay = (edu if edu else text).lower()

    # ✅ choose highest degree using ranks
    degree = detect_highest_qualification(hay)

    # ✅ branch detection (prefer longer/more specific matches)
    branch = ""
    for b in sorted(BRANCH_KEYWORDS, key=len, reverse=True):
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

    conf = 0.85 if edu else 0.65
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

def extract_experience_details(text: str, sections: Dict[str, str]) -> Tuple[List[Dict[str, str]], float]:
    exp = sections.get("experience", "")
    if not exp:
        return [], 0.0

    lines = [ln.strip() for ln in exp.split("\n") if ln.strip()]
    results: List[Dict[str, str]] = []

    # "June 2022 – Present" / "July 2021 - May 2022"
    date_re = re.compile(
        r"\b([A-Za-z]{3,9}\s+\d{4})\s*[-–]\s*(Present|[A-Za-z]{3,9}\s+\d{4})\b",
        re.I
    )

    for i, ln in enumerate(lines):
        m = date_re.search(ln)
        if not m:
            continue

        start = m.group(1).strip()
        end = m.group(2).strip()
        tenure = f"{start} - {end}"

        role = lines[i - 1] if i - 1 >= 0 else ""
        company = lines[i - 2] if i - 2 >= 0 else ""

        # Cleanup: avoid role/company being date/empty/junk
        if date_re.search(role or ""):
            role = ""
        if date_re.search(company or ""):
            company = ""

        # Sometimes company line contains location/dash; keep but trim
        company = re.sub(r"\s{2,}", " ", company).strip()
        role = re.sub(r"\s{2,}", " ", role).strip()

        results.append({
            "role": role,
            "company": company,
            "start": start,
            "end": end,
            "tenure": tenure,   # ✅ important for profile_text + UI
        })

    return results, (0.80 if results else 0.40)


# -----------------------------
# UPDATED: Better name extraction (handles ALL CAPS names + skips noise)
# -----------------------------
def _title_case_name(s: str) -> str:
    s = re.sub(r"\s+", " ", s).strip()
    if s and s.upper() == s:
        return " ".join(w.capitalize() for w in s.split())
    return s


def extract_name(text: str, sections: Dict[str, str]) -> Tuple[str, float]:
    """
    Better name extraction:
    - First try FIRST line of the whole resume text
    - Then try __top__
    - Skip titles like Data Analyst/Developer etc.
    """
    def is_bad_name(s: str) -> bool:
        low = s.lower().strip()
        bad_titles = {
            "data analyst", "software developer", "developer",
            "engineer", "student", "intern", "summary", "objective"
        }
        return low in bad_titles

    # 1) Try very first meaningful line of FULL resume
    all_lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
    for ln in all_lines[:8]:
        if "@" in ln or re.search(r"\d", ln):
            continue
        cleaned = re.sub(r"[^A-Za-z .'-]", "", ln).strip()
        cleaned = re.sub(r"\s+", " ", cleaned).strip()

        words = cleaned.split()
        if 2 <= len(words) <= 5 and not is_bad_name(cleaned):
            return _title_case_name(cleaned), 0.90

    # 2) Fallback: __top__ section
    top = (sections.get("__top__", "") or "").strip()
    top_lines = [ln.strip() for ln in top.split("\n") if ln.strip()]

    ignore_contains = ("linkedin", "github", "portfolio", "resume", "email", "phone", "www", "http")
    for ln in top_lines[:15]:
        low = ln.lower()
        if any(w in low for w in ignore_contains):
            continue
        if "@" in ln or re.search(r"\d", ln):
            continue

        cleaned = re.sub(r"[^A-Za-z .'-]", "", ln).strip()
        cleaned = re.sub(r"\s+", " ", cleaned).strip()

        words = cleaned.split()
        if 2 <= len(words) <= 5 and not is_bad_name(cleaned):
            return _title_case_name(cleaned), 0.80

    # 3) spaCy fallback
    if _NLP:
        doc = _NLP("\n".join(all_lines[:15]))
        persons = [ent.text.strip() for ent in doc.ents if ent.label_ == "PERSON"]
        if persons:
            return _title_case_name(persons[0]), 0.55

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

    # ✅ NEW: structured experience extraction (role/company/tenure)
    experience_details, c_exp_details = extract_experience_details(text, sections)

    profile = {
        "personal": {
            "full_name": name,
            "email": email,
            "phone": phone,
        },
        "education": education,
        "employment": employment,
        "skills": skills,

        # ✅ NEW FIELD
        "experience_details": experience_details,

        "confidence": {
            "full_name": round(c_name, 2),
            "email": round(c_email, 2),
            "phone": round(c_phone, 2),
            "education": round(c_edu, 2),
            "skills": round(c_skills, 2),
            "employment": round(c_emp, 2),

            # ✅ NEW CONFIDENCE KEY
            "experience_details": round(c_exp_details, 2),
        },
        "warnings": []
    }

    # warnings
    profile["warnings"] = build_warnings(profile)

    # ✅ copy-ready text (for UI "Copy to Official Portal" button)
    experience_text = ""
    if experience_details:
        experience_text = "\n".join(
            [
                f"- {x.get('role','')} | {x.get('company','')} | {x.get('tenure','')}".strip()
                for x in experience_details
            ]
        )

    profile["profile_text"] = (
        f"Full Name: {profile['personal']['full_name']}\n"
        f"Email: {profile['personal']['email']}\n"
        f"Phone: {profile['personal']['phone']}\n"
        f"Highest Qualification: {profile['education']['highest_qualification']}\n"
        f"Branch/Major: {profile['education']['branch_or_major']}\n"
        f"Institute: {profile['education']['institute']}\n"
        f"Employment: {profile['employment']['status']} {profile['employment']['years_experience']}\n"
        f"Skills: {', '.join(profile['skills'])}\n"
        + (f"Experience:\n{experience_text}\n" if experience_text else "")
    )

    return profile
