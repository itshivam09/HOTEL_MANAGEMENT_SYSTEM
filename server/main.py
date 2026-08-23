from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import users, hotels, rooms, bookings

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hotel Management System")


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(users.router, prefix="/users", tags=["Users"])

app.include_router(hotels.router, prefix="/hotels", tags=["Hotels"])

app.include_router(rooms.router, prefix="/rooms", tags=["Rooms"])

app.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])


@app.get("/")
def root():
    return {
        "message": "Hotel Management System API is running"
    }