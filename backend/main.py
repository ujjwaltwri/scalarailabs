from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import path, lessons, progress, users, leaderboard

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Duolingo Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(path.router, prefix="/api/path", tags=["path"])
app.include_router(lessons.router, prefix="/api/lessons", tags=["lessons"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(leaderboard.router, prefix="/api/leaderboard", tags=["leaderboard"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Duolingo Clone API!"}
