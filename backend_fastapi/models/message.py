from db import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    sender_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("Projects.id"), nullable=True)  # Optional: for project-specific chats
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
    
    # Relationships
    sender = relationship("User", backref="sent_messages")
    project = relationship("Project", backref="messages")