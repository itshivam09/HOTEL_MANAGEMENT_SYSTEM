from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
#do tables ke beech connection define karne ke liye
#(jaise "ek User ke kai Hotels ho sakte hain")
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    #primary_key=True -->> mtlb hrr row ka unique identifier
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user")
    #role column — agar value na do toh default "user" set hoga
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    #Jab bhi naya user create ho, current UTC time automatically save ho jayega
    hotels = relationship("Hotel", back_populates="owner")
    bookings = relationship("Booking", back_populates="user")
    #ek User ke multiple Hotels ho sakte hain" aur "ek User ke multiple Bookings ho sakte hain"
    #back_populates="owner" — Hotel table mein bhi ek owner naam ka relationship hona chahiye jo isko wapas point kare


class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    #owner_id — yeh ek Foreign Key hai, matlab yeh column users table ke id column ko point karta hai
    #Iska matlab: har hotel row mein pata chalega ki woh hotel kis user (owner) ka hai
    name = Column(String)
    city = Column(String)
    address = Column(String)
    description = Column(String, nullable=True)
    #description null ho skta hai
    owner = relationship("User", back_populates="hotels")
    #owner — is hotel ka owner (User object) directly access karne ke liye: hotel.owner.name
    rooms = relationship("Room", back_populates="hotel")
    #rooms — is hotel ke saare rooms: hotel.rooms

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id"))
    room_type = Column(String)
    price_per_night = Column(Float)
    capacity = Column(Integer)

    is_available = Column(Boolean, default=True)

    hotel = relationship("Hotel", back_populates="rooms")
    bookings = relationship("Booking", back_populates="room")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id= Column(Integer, ForeignKey("users.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"))
    #Do Foreign Keys — kis user ne, kis room ko book kiya
    check_in = Column(DateTime)
    check_out = Column(DateTime)
    status = Column(String, default="pending")  # pending/confirmed/cancelled
    total_price = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="bookings")
    room = relationship("Room", back_populates="bookings")
    #user — is booking ko kisne kiya (User object): booking.user.name
    #room — kaunsa room book hua: booking.room.room_type


    # User (1) ────< Hotel (many)
    # User (1) ──ki kai──< Booking (many)
    # Hotel (1) ──ke kai ─< Room (many)
    # Room (1) ──ki kai──< Booking (many)

class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    otp_code = Column(String)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
