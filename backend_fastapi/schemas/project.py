from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
from .task import TaskInCreate, TaskOutput

class OwnerInfo(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    
    class Config:
        from_attributes = True

class ProjectInCreate(BaseModel):
    title: str
    description: Optional[str] = None
    tasks: List[TaskInCreate] = []

    @field_validator('tasks')
    @classmethod
    def validate_tasks(cls, v):
        if not v or len(v) == 0:
            raise ValueError('At least one task is required when creating a project')
        return v

class ProjectOutput(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    owner_id: int
    created_at: datetime
    tasks: List['TaskOutput'] = []

    class Config:
        from_attributes = True

class ProjectDetailOutput(ProjectOutput):
    owner: OwnerInfo  # Now you can access owner.first_name, owner.last_name
    
    class Config:
        from_attributes = True

class ProjectInUpdate(BaseModel):
    title: str | None = None
    description: str | None = None