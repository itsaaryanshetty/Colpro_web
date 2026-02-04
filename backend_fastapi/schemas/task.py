from pydantic import BaseModel
from typing import Optional, Literal

class TaskInCreate(BaseModel):
    title: str
    assignee_id: int
    due_date: Optional[str] = None

class TaskOutput(BaseModel):
    id: int
    title: str
    status: Literal["TO DO", "IN PROGRESS", "DONE"]
    due_date: Optional[str] = None
    project_id: int
    assignee_id: int

    class Config:
        from_attributes = True

class TaskUpdate(BaseModel):
    title: str | None = None
    status: Literal["TO DO", "IN PROGRESS", "DONE"] | None = None
    due_date: Optional[str] = None
    assignee_id: Optional[int] = None