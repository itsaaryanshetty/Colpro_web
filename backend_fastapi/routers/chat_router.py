# handles chat related endpoints and websocket connections
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from typing import List
import json
from datetime import datetime

from db import get_db
from models.message import Message
from models.user import User
from schemas.message import MessageOutput, MessageCreate
from websocket_manager import manager
from security.authHandler import AuthHandler

chatRouter = APIRouter()

# WebSocket endpoint for real-time chat
@chatRouter.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str, db: Session = Depends(get_db)):
    # Verify token
    payload = AuthHandler.decode_jwt(token)
    if not payload or not payload.get("user_id"):
        await websocket.close(code=1008)
        return
    
    user_id = payload["user_id"]
    
    # Connect user
    await manager.connect(websocket, user_id)
    # User's WebSocket is stored in the manager's dictionary.
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Save message to database
            new_message = Message(
                content=message_data.get("content"),
                sender_id=user_id,
                project_id=message_data.get("project_id")
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
                "sender_name": f"{sender.first_name} {sender.last_name}",
                "project_id": new_message.project_id,
                "created_at": new_message.created_at.isoformat(),
                "is_read": False
            }
            
            # Broadcast to project members or all users
            if message_data.get("project_id"):
                await manager.send_to_project_members(
                    broadcast_data, 
                    message_data.get("project_id"),
                    db
                )
            else:
                await manager.broadcast(broadcast_data)
    
    # handle disconnection and other exceptions
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, user_id)

# REST endpoint to get message history
@chatRouter.get("/messages", response_model=List[MessageOutput])
def get_messages(
    project_id: int = None,
    limit: int = 50, # get last 50 messages
    db: Session = Depends(get_db)
):
    """Get recent messages (optionally filtered by project)"""
    query = db.query(Message)
    
    if project_id:
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
            "sender_name": f"{sender.first_name} {sender.last_name}" if sender else "Unknown",
            "project_id": msg.project_id,
            "created_at": msg.created_at,
            "is_read": msg.is_read
        })
    
    return reversed(result)  # Oldest first