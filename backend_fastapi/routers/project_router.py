from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db import get_db
from services.project_service import ProjectService
from schemas.project import ProjectInCreate, ProjectOutput
from schemas.user import UserOutput
from protectRoute import get_current_user
from fastapi.security import HTTPBearer

projectRouter = APIRouter()
security = HTTPBearer()

@projectRouter.post("/", status_code=201, response_model=ProjectOutput)
def create_project(
    projectDetails: ProjectInCreate, 
    current_user: UserOutput = Depends(get_current_user),
    session: Session = Depends(get_db),
    token: str = Depends(security)
):
    try:
        if current_user.role != "Admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only Admins can create Projects"
            )
        
        return ProjectService(session=session).create_new_project(
            project_details=projectDetails,
            owner_id=current_user.id
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as error:
        print(error)
        raise error

@projectRouter.get("/", status_code=200, response_model=list[ProjectOutput])
def get_projects(
    current_user: UserOutput = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    try:
        return ProjectService(session=session).get_projects(owner_id=current_user.id)
    except Exception as error:
        print(error)
        raise error

@projectRouter.get("/{project_id}", status_code=200, response_model=ProjectOutput)
def get_project_by_id(
    project_id: int,
    current_user: UserOutput = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    try:
        return ProjectService(session=session).get_project_by_id_service(
            project_id=project_id,
            owner_id=current_user.id
        )
    except Exception as error:
        print(error)
        raise error

@projectRouter.delete("/{project_id}", status_code=200)
def delete_project(
    project_id: int,
    current_user: UserOutput = Depends(get_current_user),
    session: Session = Depends(get_db),
    token: str = Depends(security)
):
    try:
        if current_user.role != "Admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only Admins can delete Projects"
            )
        
        return ProjectService(session=session).delete_project(
            project_id=project_id,
            owner_id=current_user.id
        )
    except HTTPException as he:
        raise he
    except Exception as error:
        print(error)
        raise error