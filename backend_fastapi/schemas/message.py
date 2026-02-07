from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageCreate(BaseModel):
    content: str
    project_id: int # New field for project association

class MessageOutput(BaseModel):
    id: int
    content: str
    sender_id: int
    sender_first_name: str  # Will be populated from relationship
    sender_last_name: str
    project_id: int
    created_at: datetime
    is_read: bool
    
    class Config:
        from_attributes = True

# class MessageWithSender(MessageOutput):
#     sender_first_name: str
#     sender_last_name: str