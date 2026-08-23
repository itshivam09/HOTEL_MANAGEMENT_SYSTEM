from sqlalchemy import create_engine
#database se connection banane ke liye function
from sqlalchemy.ext.declarative import declarative_base
#ye hme ek base class deta hai, jisse hum apne models(user, hotel, room, etc) banate hai 
from sqlalchemy.orm import sessionmaker
#ek factory hai jo database session(conversations) banate hai

SQLALCHEMY_DATABASE_URL = "sqlite:///./hotel.db"
#sqlite:///./hotel.db --->>> sqlite:// -> hum SQLLite database use krr rhe hai 
# /./hotel.db  -->> is folder me hotel.db naam ki file bnegi aur usme saara data store hoga

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread" : False}
)
#create_engine(...) — actual connection banata hai us database URL se
#connect_args={"check_same_thread": False} -->> sirf SQLLite ke liye jaruri hai bss
#kyuki SQLite ek hi thread ek hi saath access se access hone deta hai agr ek se jyada hoga to error aa jayega

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
#SessionLocal -> (har request ke liye session banane ka tarika)
#autoflush=False -->> pending changes ko query se temporary send nhi krega
#bind=engine — is session ko upar wale engine se jodta hai, taaki pata chale kis database se baat karni hai

Base = declarative_base()
#Yeh ek base class banata hai
#Aapke saare models (User, Hotel, Room, Booking — models.py mein) is Base ko inherit karte hain: class User(Base):
