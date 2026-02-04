# manages all active connections. it is the brain of the websocket system.
from typing import List, Dict
from fastapi import WebSocket
import json
from datetime import datetime

class ConnectionManager:
    def __init__(self):
        # Store active connections: {user_id: [websocket1, websocket2, ...]}
        # One user can have multiple connections (multiple browser tabs)
        self.active_connections: Dict[int, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: int):

        # when a user connects, add their websocket to the active connections
        # stores it in a dict with user_id as key and list of websockets as value
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        print(f"User {user_id} connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket, user_id: int):
        # When user closes the tab or loses connection, clean up. Remove their websocket from active connections
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        print(f"User {user_id} disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: dict, user_id: int):
        """Send message to a specific user"""
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_json(message)
    
    async def broadcast(self, message: dict):
        """Send message to all connected users"""
        for user_connections in self.active_connections.values():
            for connection in user_connections:
                await connection.send_json(message)
    
    async def send_to_project_members(self, message: dict, project_id: int, session):
        """Send message to all members of a project"""
        # Send message only to team members of a specific project.
        from models.projects import Project
        
        project = session.query(Project).filter_by(id=project_id).first()
        if not project:
            return
        
        # Get all project member IDs (owner + task assignees)
        member_ids = {project.owner_id}
        for task in project.tasks:
            if task.assignee_id:
                member_ids.add(task.assignee_id)
        
        # Send to all online members
        for member_id in member_ids:
            await self.send_personal_message(message, member_id)

manager = ConnectionManager()