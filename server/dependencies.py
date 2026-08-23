from database import SessionLocal
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from auth import decode_access_token
import models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")
#Yeh ek dependency object banata hai jo automatically request ke header se token nikalta hai

def get_db():
    db = SessionLocal() #nya session bna 
    #matlab database ke saath ek temporary "conversation" shuru hoti hai jisse hum queries chala sakein.
    try:
        yield db #yield ka matlab return jaisa nahi hai. yield session ko route function ko de deta hai use karne ke liye
    finally:
        db.close()
#Yeh zaroori kyun hai?

# Agar aap session close na karo, toh:
# Connection database ke saath khula reh jayega (memory leak jaisa)
# Bahut saari requests aane pe connections khatam ho jayenge, aur naye users connect nahi ho payenge

#try/finally ensure karta hai ki chahe kuch bhi ho jaye (error ho ya na ho), session zaroor close ho.

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    email = payload.get("sub")
    if email is None:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

def require_role(required_role: str):
    def role_checker(current_user: models.User = Depends(get_current_user)):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Only {required_role}s can perform this action"
            )
        return current_user
    return role_checker

def require_role(required_role: str):
    def role_checker(current_user: models.User = Depends(get_current_user)):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Only {required_role}s can perform this action"
            )
        return current_user
    return role_checker