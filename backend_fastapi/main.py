from fastapi import FastAPI, status, Depends, HTTPException
# ADD THIS LINE - Import your models so they register with Base
from models import user, projects, tasks, message  # This imports user.py, project.py, and task.py from the models folder
from routers.auth import authRouter
from routers.project_router import projectRouter
from routers.task_router import taskRouter
from routers.user_router import userRouter
from routers.chat_router import chatRouter

from contextlib import asynccontextmanager
from db import engine, SessionLocal, create_tables
from typing import Annotated
from sqlalchemy.orm import Session
from protectRoute import get_current_user
from schemas.user import UserOutput

#everytime the application starts -> the tbales should get created
@asynccontextmanager
async def lifespan(app: FastAPI):
    #Initialize DB at start
    print("Created")
    create_tables()
    yield #separation point

app = FastAPI(lifespan=lifespan)
app.include_router(router=authRouter, tags=["auth"], prefix="/auth")
#/auth/login   /auth/signup

app.include_router(router= projectRouter, tags=["projects"], prefix="/projects")
app.include_router(router= taskRouter, tags=["tasks"], prefix="/tasks")
app.include_router(router= userRouter, tags=["users"], prefix="/users")

app.include_router(router= chatRouter, tags=["chat"], prefix="/chat")
# models.Base.metadata.create_all(bind = engine)

@app.get("/protected")
def read_protected(user: UserOutput = Depends(get_current_user)):
    return {"data" : user}


#---------------INtegrating frontend and backend--------------------
from fastapi.middleware.cors import CORSMiddleware
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
    "http://65.2.107.195:8000",
    "http://65.2.107.195:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "Welcome to the API",
        "docs": "/docs",
        "status": "running"
    }