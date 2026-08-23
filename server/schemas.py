#API mein data kaise aana chahiye (request) aur kaise wapas jana chahiye (response).

from pydantic import BaseModel, field_validator, Field
from datetime import datetime
from typing import Optional, Annotated

class UserCreate(BaseModel):
    name : Annotated[str, Field(..., description="Enter Your Name : ", examples=["Mohan"])]
    email : str
    password : str
    role: str = "user"

    @field_validator("role")
    @classmethod
    def validate_role(cls, value):
        allowed_roles = {"user", "hotel_owner"}
        if value not in allowed_roles:
            raise ValueError(f"role must be one of {allowed_roles}")
        return value

class UserOut(BaseModel):
    id : int
    name : str
    email : str
    role : str
#hashed_password yahan jaan-bujhkar nahi hai!
#Isliye response mein kabhi bhi password ka hash user ko dikhega hi nahi — security ke liye yeh bahut zaroori hai.
    class Config:
        from_attributes = True
        #ye pydantic ko batata hai yeh schema seedha SQLAlchemy model object (jaise models.User) se data utha sakta hai, dictionary ki tarah nahi."

class Token(BaseModel):
    access_token: str
    token_type: str
#Login ke baad jo JWT token wapas bhejte hain, uska format — /login endpoint isi shape mein response deta hai:

class HotelCreate(BaseModel):
    name: str
    city: str
    address: str
    description: Optional[str] = None

class HotelOut(HotelCreate):#isme HotelCreate ko inherit krr rha hai
    id : int
    owner_id : int

    class Config:
        from_attributes = True

class RoomCreate(BaseModel):
    room_type: str
    price_per_night: float
    capacity: int

class RoomOut(RoomCreate):
    id : int
    hotel_id : int
    is_available: bool

    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    room_id: int
    check_in: datetime
    check_out: datetime

class BookingOut(BaseModel):
    id: int
    user_id: int
    room_id: int
    check_in: datetime
    check_out: datetime
    status: str
    total_price: float

    class Config:
        from_attributes = True

class OTPVerify(BaseModel):
    email: str
    otp_code: str

    # ==========================================
# OWNER BOOKING RESPONSE
# ==========================================

class OwnerBookingOut(BaseModel):
    id: int

    # Customer details
    user_id: int
    customer_name: str
    customer_email: str

    # Hotel details
    hotel_id: int
    hotel_name: str

    # Room details
    room_id: int
    room_type: str

    # Booking details
    check_in: datetime
    check_out: datetime
    status: str
    total_price: float

    class Config:
        from_attributes = True