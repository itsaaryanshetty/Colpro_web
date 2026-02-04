from db import Base
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy import DateTime

class Project(Base):
    __tablename__ = "Projects"

    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    owner_id = Column(Integer, ForeignKey("Users.id"))
    # owner_name = Column(String(100), ForeignKey("Users.first_name"))
    created_at = Column(DateTime, default=datetime.now)
    
    owner = relationship("User", back_populates="projects", foreign_keys=[owner_id])
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")