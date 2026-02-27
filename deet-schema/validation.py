import json
import re
from pathlib import Path

from jsonschema import validate
from jsonschema.exceptions import ValidationError

_SCHEMA_PATH = Path(__file__).with_name("json_schema_validator.json")


def validate_with_schema(data):
    with _SCHEMA_PATH.open(encoding="utf-8") as f:
        schema = json.load(f)

    try:
        validate(instance=data, schema=schema)
        return []
    except ValidationError as e:
        return [str(e)]


def validate_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not isinstance(email, str):
        return False
    return re.match(pattern, email) is not None

def validate_phone(phone):
    return isinstance(phone, str) and phone.isdigit() and len(phone) == 10

def validate_year(year):
    return isinstance(year, str) and year.isdigit() and 1900 <= int(year) <= 2100

def validate_profile(data):
    errors = []

    profile = data.get("profile", data)

    if not profile["personal"]["name"]:
        errors.append("Name is required")

    if not validate_email(profile["personal"]["email"]):
        errors.append("Invalid email")

    if not validate_phone(profile["personal"]["phone"]):
        errors.append("Invalid phone number")

    if not validate_year(profile["education"]["year_of_passing"]):
        errors.append("Invalid passing year")

    return errors