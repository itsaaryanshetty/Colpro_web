from db import Base
from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key = True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100), unique=True)
    role = Column(Enum("Admin", "Member", name="user_roles"), default="Member", nullable=False)
    password = Column(String(100))
#new add ons
#doesnt create a column in the database -> creates a Python side link 
#bet two tables so that u can navigate bet objects easily
    projects = relationship("Project", back_populates="owner")
    tasks = relationship("Task", back_populates="assignee")

#In User -> projects = relationship("Project", back_populates="owner")
#In Project -> owner = relationship("User", back_populates="projects")

#What this means:

#One User can own many Projects
#One Project belongs to one User
#This is called: One-to-Many