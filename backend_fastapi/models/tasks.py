from db import Base
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy import DateTime


class Task(Base):

    __tablename__ = "Tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    status = Column(
        Enum("TO DO", "IN PROGRESS", "DONE", name="task_status"),
        default="TO DO", 
        nullable=False,
    )

    due_date = Column(String(50), nullable=True)
    project_id = Column(Integer, ForeignKey("Projects.id"), nullable=False)
    assignee_id = Column(Integer, ForeignKey("Users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.now)

    
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="tasks")