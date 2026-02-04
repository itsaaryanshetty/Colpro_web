from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from schemas.task import TaskUpdate, TaskOutput
from schemas.user import UserOutput
from services.task_service import TaskService
from db import get_db
from protectRoute import get_current_user

taskRouter = APIRouter()

@taskRouter.get("/", status_code=200, response_model=List[TaskOutput])
def get_tasks(
    current_user: UserOutput = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    """Get all tasks assigned to the current user"""  # ✅ UPDATED DESCRIPTION
    try:
        # Changed from get_user_tasks to get_assigned_tasks
        return TaskService(session=session).get_assigned_tasks(user_id=current_user.id)
    except Exception as error:
        print(error)
        raise error

@taskRouter.get("/{task_id}", status_code=200, response_model=TaskOutput)
def get_task_by_id(
    task_id: int,
    current_user: UserOutput = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    try:
        # Allow users to see tasks assigned to them
        task_service = TaskService(session=session)
        task = task_service.get_task_by_id(id=task_id)
        
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Check if user is either the assignee or the project owner
        if task.assignee_id != current_user.id and task.project.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        return task
    except HTTPException:
        raise
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail="Internal server error")

@taskRouter.put("/{task_id}", status_code=200, response_model=TaskOutput)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: UserOutput = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    try:
        task_service = TaskService(session=session)
        task = task_service.get_task_by_id(id=task_id)
        
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Only assignee can update their own tasks
        if task.assignee_id != current_user.id:
            raise HTTPException(
                status_code=403, 
                detail="Only the assignee can update this task"
            )
        
        # Update task
        update_data = task_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(task, key, value)
        
        session.commit()
        session.refresh(task)
        return task
        
    except HTTPException:
        raise
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail="Internal server error")

@taskRouter.delete("/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    current_user: UserOutput = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    try:
        task_service = TaskService(session=session)
        task = task_service.get_task_by_id(id=task_id)
        
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Only project owner can delete tasks
        if task.project.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Only the project owner can delete tasks"
            )
        
        session.delete(task)
        session.commit()
        return None
        
    except HTTPException:
        raise
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail="Internal server error")