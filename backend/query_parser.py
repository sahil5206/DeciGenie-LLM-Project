# query_parser.py

import re
import spacy

nlp = spacy.load("en_core_web_sm")

def extract_age(text):
    match = re.search(r"(\d{2})[- ]?year[- ]?old", text)
    return int(match.group(1)) if match else None

def extract_gender(text):
    text = text.lower()
    if "male" in text or "man" in text:
        return "male"
    elif "female" in text or "woman" in text:
        return "female"
    return None

def extract_policy_duration(text):
    match = re.search(r"(\d+)[- ]?(month|year)", text.lower())
    if match:
        number = int(match.group(1))
        unit = match.group(2)
        return number * 12 if "year" in unit else number
    return None

def extract_city(text):
    # naive extraction using spaCy's GPE (Geopolitical Entity)
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "GPE":
            return ent.text
    return None

def extract_procedure(text):
    # very naive: look for "surgery" + previous 2 words
    match = re.search(r"([a-zA-Z\s]+?)\s+(surgery)", text.lower())
    if match:
        return match.group(0)
    return None

def parse_query(query: str):
    return {
        "age": extract_age(query),
        "gender": extract_gender(query),
        "procedure": extract_procedure(query),
        "city": extract_city(query),
        "policy_duration_months": extract_policy_duration(query)
    }

# Test
if __name__ == "__main__":
    sample = "46-year-old male, knee surgery in Pune, 3-month-old insurance policy"
    parsed = parse_query(sample)
    print(parsed)