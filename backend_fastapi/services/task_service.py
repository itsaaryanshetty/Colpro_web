from sqlalchemy.orm import Session
from models.tasks import Task
from models.projects import Project
from schemas.task import TaskInCreate, TaskOutput, TaskUpdate
from fastapi import HTTPException

class TaskService:
    def __init__(self, session: Session):
        self.session = session

    # def create_task(self, task_data: TaskInCreate):
    #     newTask = Task(**task_data.model_dump(exclude_none=True))

    #     self.session.add(newTask)
    #     self.session.commit()
    #     self.session.refresh(newTask)

    #     return newTask

    def get_task_by_id(self, id: int) -> Task:
        task = self.session.query(Task).filter_by(id=id).first()
        return task

    # def create_new_task(self, task_details: TaskInCreate) -> TaskOutput:
    #     return self.create_task(task_data=task_details)

    # def get_tasks(self):
    #     tasks = self.session.query(Task).all()
    #     return tasks

    # def get_task_by_id_service(self, task_id: int):
    #     task = self.get_task_by_id(id=task_id)
    #     if task:
    #         return task
    #     raise HTTPException(status_code=404, detail="Task not found")
    
    
    def get_user_tasks(self, user_id: int):
        """Get all tasks from projects owned by the user"""
        tasks = self.session.query(Task).join(Project).filter(
            Project.owner_id == user_id
        ).all()
        return tasks
    
    def get_assigned_tasks(self, user_id: int):  # ✅ ADD THIS METHOD
        """Get all tasks assigned to a specific user"""
        tasks = self.session.query(Task).filter(
            Task.assignee_id == user_id
        ).all()
        return tasks

    def get_task_by_id_service(self, task_id: int, user_id: int):
        task = self.session.query(Task).join(Project).filter(
            Task.id == task_id,
            Project.owner_id == user_id
        ).first()
        
        if task:
            return task
        raise HTTPException(status_code=404, detail="Task not found")
    
    def update_task(self, task_id: int, task_data: TaskUpdate, user_id: int):
        task = self.get_task_by_id_service(task_id=task_id, user_id=user_id)
        
        update_data = task_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(task, key, value)
        
        self.session.commit()
        self.session.refresh(task)
        return task

    def delete_task(self, task_id: int, user_id: int):
        task = self.get_task_by_id_service(task_id=task_id, user_id=user_id)
        self.session.delete(task)
        self.session.commit()
        return True