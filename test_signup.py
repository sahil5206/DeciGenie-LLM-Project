import requests

url = "http://localhost:8000/api/user/signup"
payload = {
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "testpass123"
}
try:
    r = requests.post(url, json=payload)
    print("Status code:", r.status_code)
    print("Response:", r.text)
except Exception as e:
    print("Error:", e) 