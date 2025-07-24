# llm_reasoner.py

import os
import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def build_prompt(query: str, parsed: dict, clauses: list):
    clauses_text = "\n\n".join([f"(Page {c['page']} - {c['source']}): {c['text']}" for c in clauses])
    
    prompt = f"""
You are an expert insurance claims analyst.

Given the customer query and the extracted clauses, determine:

1. Should the procedure be approved or rejected?
2. If approved, what is the payout amount?
3. What clause(s) support this decision?

---

Query:
{query}

Structured Input:
{parsed}

Relevant Clauses:
{clauses_text}

---

Respond in this strict JSON format:

{{
  "decision": "Approved" or "Rejected",
  "amount": number (or 0),
  "justification": "Explain decision and reference clause(s) used"
}}
"""
    return prompt.strip()

def get_decision(query: str, parsed: dict, clauses: list):
    prompt = build_prompt(query, parsed, clauses)

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful insurance claims assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
    )

    reply = response['choices'][0]['message']['content']
    return reply

# Example test
if __name__ == "__main__":
    dummy_query = "46-year-old male, knee surgery in Pune, 3-month-old insurance policy"
    dummy_parsed = {
        "age": 46,
        "gender": "male",
        "procedure": "knee surgery",
        "city": "Pune",
        "policy_duration_months": 3
    }
    dummy_clauses = [
        {
            "source": "BAJHLIP23020V012223.pdf",
            "page": 10,
            "text": "Knee surgery is covered after 90 days from policy inception."
        },
        {
            "source": "HDFHLIP23024V072223.pdf",
            "page": 12,
            "text": "Surgeries performed within the first 90 days of a new policy are not covered unless due to an accident."
        }
    ]
    
    result = get_decision(dummy_query, dummy_parsed, dummy_clauses)
    print(result)