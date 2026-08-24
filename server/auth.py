from datetime import timedelta, datetime
#time calculate karne ke liye (token kab expire hoga)
from jose import JWTError, jwt
#python-jose library — JWT tokens banane aur decode karne ke liye
from pwdlib import PasswordHash
#library se, password hash karne ke liye
from dotenv import load_dotenv
import os
import random

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
#JWT token sign karne ka method (industry standard choice)
ACCESS_TOKEN_EXPIRE_MINUTES = 15

pwd_context = PasswordHash.recommended()
#ek object banaya jo secure password hashing algorithm use karega
#taaki database mein plain password kabhi store na ho

def hash_password(password: str):
    return pwd_context.hash(password)
#Plain password lekar ek secure hash return karta hai — yeh register karte waqt use hota hai, 
#taaki database mein plain password kabhi store na ho

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data : dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp" : expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#data.copy() — jo dictionary aayi (jaise {"sub": "raj@example.com"}), uski copy banayi
# expire = ... — current time + 60 minutes calculate kiya
# to_encode.update({"exp": expire}) — expiry time ko dictionary mein add kiya
# jwt.encode(...) — poori dictionary ko SECRET_KEY se sign karke ek JWT token string bana di (jaise eyJhbGc...)

def decode_access_token(token : str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        return payload
    except JWTError:
        return None
#Token ko SECRET_KEY se wapas decode/verify karne ki koshish karta hai

def generate_otp():
    return str(random.randint(100000, 999999))