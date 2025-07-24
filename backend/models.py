from pydantic import BaseModel

class UserProfile(BaseModel):
    name: str
    email: str
    profile_picture: str = ""
    queries_made: int = 0
    last_login: str = ""
    created_at: str = ""



