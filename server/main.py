import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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


@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "message": "Hotel Management System API is running successfully"
    }


# Check if React client dist exists (supports single full-stack Web Service deployment)
client_dist = os.path.join(os.path.dirname(__file__), "..", "client", "dist")
if not os.path.exists(client_dist):
    client_dist = os.path.join(os.path.dirname(__file__), "dist")

if os.path.exists(client_dist):
    assets_dir = os.path.join(client_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Do not intercept API or documentation routes
        if full_path.startswith(("users", "hotels", "rooms", "bookings", "api", "docs", "openapi.json", "redoc")):
            return {"detail": "Not Found"}

        file_path = os.path.join(client_dist, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)

        index_file = os.path.join(client_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)

        return {"status": "online", "message": "API Running. Frontend dist not found."}
else:
    @app.get("/")
    def root():
        return {
            "status": "online",
            "message": "Hotel Management System API is running successfully. To see the frontend, deploy the client folder as a Render Static Site."
        }