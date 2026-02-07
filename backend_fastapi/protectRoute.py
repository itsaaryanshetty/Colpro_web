from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from security.authHandler import AuthHandler
from services.user_service import UserService
from db import get_db
from schemas.user import UserOutput

security = HTTPBearer()

def get_current_user(
    credentials = Depends(security),  # This returns HTTPAuthorizationCredentials object
    session: Session = Depends(get_db)
) -> UserOutput:
    
    auth_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid Authentication"
    )

    # Extract the actual token string from the credentials object
    token = credentials.credentials  # THIS IS THE KEY LINE
    print(f"DEBUG: Token = {token[:30]}...")
    
    payload = AuthHandler.decode_jwt(token=token)
    print(f"DEBUG: Payload = {payload}")
    
    if payload and payload.get("user_id"):
        try:
            user = UserService(session=session).get_user_by_id_service(payload["user_id"])
            print(f"DEBUG: User authenticated: {user.email}") 
            return UserOutput(
                id=user.id,
                first_name=user.first_name,
                last_name=user.last_name,
                email=user.email,
                role=user.role
            )
        except Exception as error:
            print(f"DEBUG: Error getting user: {error}")
            raise auth_exception
    
    print("DEBUG: Invalid payload or missing user_id")
    raise auth_exception

def get_current_user_id(
    credentials = Depends(security)
) -> int:
    """Get just the user ID (lighter than full user object)"""
    token = credentials.credentials
    payload = AuthHandler.decode_jwt(token=token)
    
    if not payload or not payload.get("user_id"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authentication"
        )
    
    return payload["user_id"]