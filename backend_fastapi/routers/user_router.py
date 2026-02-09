from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db
from services.user_service import UserService
from schemas.user import UserOutput
from protectRoute import get_current_user
from typing import List
from models.user import User
from models.tasks import Task
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
    
@userRouter.get("/leaderboard/stats", status_code=200)
def get_leaderboard(
    current_user: UserOutput = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    """Get leaderboard - all users ranked by completed tasks"""
    try:
        # Get all users
        all_users = session.query(User).all()
        
        leaderboard = []
        
        # For each user, count their DONE tasks
        for user in all_users:
            done_tasks_count = (
                session.query(Task)
                .filter(Task.assignee_id == user.id)
                .filter(Task.status == 'DONE')
                .count()
            )

            full_name = f"{user.first_name} {user.last_name}".strip()
            
            leaderboard.append({
                "id": user.id,
                "full_name": full_name,
                "email": user.email,
                "tasksCompleted": done_tasks_count
            })
        
        # Sort by tasksCompleted in descending order
        leaderboard.sort(key=lambda x: x["tasksCompleted"], reverse=True)
        
        return leaderboard
        
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail="Internal server error")

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