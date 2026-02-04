from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db
from services.user_service import UserService
from schemas.user import UserOutput
from protectRoute import get_current_user
from typing import List
from models.user import User
# from fastapi.security import HTTPBearer

userRouter = APIRouter()

@userRouter.get("/", status_code=200, response_model=List[UserOutput])
def get_all_users(
    current_user: UserOutput = Depends(get_current_user),
    session: Session = Depends(get_db)

):
    try:
        # Get all users from database
        users = session.query(User).all()
        return users
    except Exception as error:
        print(error)
        raise error

@userRouter.get("/{user_id}", status_code=200, response_model=UserOutput)
def get_user_by_id(
    user_id: int,
    current_user: UserOutput = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    """Get a specific user by ID"""
    try:
        return UserService(session=session).get_user_by_id_service(user_id=user_id)
    except Exception as error:
        print(error)
        raise error