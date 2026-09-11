import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import users, hotels, rooms, bookings

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hotel Management System API")

# Dynamically resolve CORS allowed origins
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

custom_frontend = os.getenv("FRONTEND_URL")
if custom_frontend:
    allowed_origins.extend([origin.strip() for origin in custom_frontend.split(",") if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if custom_frontend else ["*"],
    allow_origin_regex=r"https://.*\.onrender\.com|https://.*\.vercel\.app|http://localhost:5173|http://127\.0\.0\.1:5173",
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
        "status": "online",
        "message": "Hotel Management System API is running successfully on Render"
    }