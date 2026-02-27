# DEET Profile Schema Documentation

This file defines the structured JSON format for resume conversion.

## Sections

1. Personal Details
2. Education
3. Skills
4. Employment
5. Address

## Mandatory Fields
- personal.name
- personal.email
- personal.phone
- education.highest_degree
- education.year_of_passing

## Field Constraints

- Phone must be 10 digits
- Email must follow valid email format
- Year of passing must be between 1900 and 2100
- Skills must be an array of strings
- Employment status must be either "Fresher" or "Experienced"

## Default Rules

- If a field is not found in resume → set as null
- If no skills found → return empty array []
- If no employment history → set status as "Fresher"

## 🧩 STEP 2 – Define Data Flow

Resume Upload  
    ↓  
OCR (Person 1)  
    ↓  
Raw Text  
    ↓  
NLP Extraction (Person 2)  
    ↓  
Structured JSON (Your Schema)  
    ↓  
Validation (Your Code)  
    ↓  
Frontend Autofill (Person 4)

## API Response Contract

All backend responses must follow this format:

```json
{
  "status": "success" | "error",
  "message": "Description of result",
  "data": {
    // DEET Profile JSON (schema defined in schema.json)
  }
}
```

### Example Success Response

```json
{
  "status": "success",
  "message": "Profile generated successfully",
  "data": {
    "version": "1.0",
    "profile": { ... }
  }
}
```

### Example Error Response

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    "Invalid email format",
    "Missing highest_degree"
  ]
}
```

## Full Working Example

Input: Resume text

```text
Harsh Sharma
Email: harsh.sharma@gmail.com
Phone: 9876543210

Education:
B.Tech (CSE), 2024
```

Output: Structured JSON (matches `schema.json`)

```json
{
  "version": "1.0",
  "profile": {
    "personal": {
      "name": "Harsh Sharma",
      "email": "harsh.sharma@gmail.com",
      "phone": "9876543210",
      "dob": null,
      "gender": null
    },
    "education": {
      "highest_degree": "B.Tech",
      "branch": "CSE",
      "institution": null,
      "year_of_passing": "2024",
      "percentage": null
    },
    "skills": [],
    "employment": {
      "status": "Fresher",
      "experience_years": null,
      "last_company": null
    },
    "address": {
      "state": null,
      "district": null,
      "pincode": null
    }
  }
}
```

Validated (Python)

```python
from validation import validate_with_schema

errors = validate_with_schema(data)
assert errors == [], errors
```

Returned to frontend (API response)

```json
{
  "status": "success",
  "message": "Profile generated successfully",
  "data": {
    "version": "1.0",
    "profile": { "...": "same as output above" }
  }
}
```

All modules (OCR, NLP, Frontend) must follow this structure.