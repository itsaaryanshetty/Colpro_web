# handles chat related endpoints and websocket connections
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
from datetime import datetime

from db import get_db
from models.message import Message
from models.user import User
from models.projects import Project
from schemas.message import MessageOutput, MessageCreate
from websocket_manager import manager
from security.authHandler import AuthHandler
from protectRoute import get_current_user_id

chatRouter = APIRouter()

def is_user_project_member(session: Session, project_id: int, user_id: int) -> bool:
    """Check if user is a member of the project"""
    project = session.query(Project).filter_by(id=project_id).first()
    
    if not project:
        return False
    
    if project.owner_id == user_id:
        return True
    
    for task in project.tasks:
        if task.assignee_id == user_id:
            return True
    
    return False

# WebSocket endpoint for real-time PROJECT-BASED chat
@chatRouter.websocket("/ws/{token}/{project_id}")
async def websocket_endpoint(websocket: WebSocket, token: str, project_id: int, db: Session = Depends(get_db)):
    # Verify token
    payload = AuthHandler.decode_jwt(token)
    if not payload or not payload.get("user_id"):
        await websocket.close(code=1008)
        return
    
    user_id = payload["user_id"]

    # Check if user is member of the project
    if not is_user_project_member(db, project_id, user_id):
        await websocket.close(code=1008, reason="Not a member of this project")
        return
    
    # Connect user
    await manager.connect(websocket, user_id)
    # User's WebSocket is stored in the manager's dictionary.
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)

            message_data["project_id"] = project_id  # Ensure project_id is set
            
            # Save message to database
            new_message = Message(
                content=message_data.get("content"),
                sender_id=user_id,
                project_id=project_id
            )
            db.add(new_message)
            db.commit()
            db.refresh(new_message)
            
            # Get sender info
            sender = db.query(User).filter_by(id=user_id).first()
            
            # Prepare message to broadcast
            broadcast_data = {
                "type": "message",
                "id": new_message.id,
                "content": new_message.content,
                "sender_id": user_id,
                "sender_first_name": sender.first_name,
                "sender_last_name": sender.last_name,
                "project_id": project_id,
                "created_at": new_message.created_at.isoformat(),
                "is_read": False
            }
            
            await manager.send_to_project_members(broadcast_data, project_id, db)
    
    # handle disconnection and other exceptions
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        print(f"User {user_id} disconnected from project {project_id} chat")

    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, user_id)

# REST endpoint to get message history
@chatRouter.get("/messages/{project_id}", response_model=List[MessageOutput])
def get_project_messages(
    project_id: int,
    limit: int = 50, # get last 50 messages
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get recent messages (optionally filtered by project)"""
    query = db.query(Message)
    
    if not is_user_project_member(db, project_id, current_user_id):
        raise HTTPException(status_code=403, detail="User is not a member of this project")
    
    query = query.filter(Message.project_id == project_id)
    
    messages = query.order_by(Message.created_at.desc()).limit(limit).all()
    
    # Enrich with sender info
    result = []
    for msg in messages:
        sender = db.query(User).filter_by(id=msg.sender_id).first()
        result.append({
            "id": msg.id,
            "content": msg.content,
            "sender_id": msg.sender_id,
            "sender_first_name": sender.first_name if sender else "Unknown",
            "sender_last_name": sender.last_name if sender else "",
            "project_id": msg.project_id,
            "created_at": msg.created_at,
            "is_read": msg.is_read
        })
    
    return reversed(result)  # Oldest first

@chatRouter.get("/my-projects")
def get_my_chat_projects(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    """Get all projects where user is a member (can chat)"""
    from models.tasks import Task
    
    # Get projects where user is owner
    owned_projects = db.query(Project).filter(Project.owner_id == current_user_id).all()
    
    # Get projects where user has tasks
    task_projects = db.query(Project).join(Task).filter(
        Task.assignee_id == current_user_id
    ).distinct().all()
    
    # Combine and deduplicate
    all_projects = {p.id: p for p in owned_projects + task_projects}
    
    return [
        {
            "id": p.id,
            "title": p.title,
            "description": p.description
        }
        for p in all_projects.values()
    ]