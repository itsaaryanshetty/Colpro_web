from sqlalchemy.orm import Session
from models.projects import Project
from models.tasks import Task
from schemas.project import ProjectInCreate, ProjectOutput
from fastapi import HTTPException

class ProjectService:
    def __init__(self, session: Session):
        self.session = session

    def create_project(self, project_data: ProjectInCreate, owner_id: int):
        # Create the project first
        newProject = Project(
            title=project_data.title,
            description=project_data.description,
            owner_id=owner_id
        )
        
        self.session.add(newProject)
        self.session.flush()  # Get the project ID without committing
        
        # Create tasks for this project
        for task_data in project_data.tasks:
            newTask = Task(
                title=task_data.title,
                assignee_id=task_data.assignee_id,
                due_date=task_data.due_date,
                project_id=newProject.id,
                status="TO DO"  # Default status
            )
            self.session.add(newTask)
        
        self.session.commit()
        self.session.refresh(newProject)
        
        return newProject

    def get_project_by_id(self, id: int) -> Project:
        project = self.session.query(Project).filter_by(id=id).first()
        return project

    def create_new_project(self, project_details: ProjectInCreate, owner_id: int) -> ProjectOutput:
        return self.create_project(project_data=project_details, owner_id=owner_id)

    def get_projects(self, owner_id: int):
        """Get all projects for a specific user"""
        projects = self.session.query(Project).filter_by(owner_id=owner_id).all()
        return projects

    def get_project_by_id_service(self, project_id: int, owner_id: int):
        project = self.session.query(Project).filter_by(
            id=project_id,
            owner_id=owner_id
        ).first()
        
        if project:
            return project
        raise HTTPException(status_code=404, detail="Project not found")






# from sqlalchemy.orm import Session
# from models.projects import Project
# from schemas.project import ProjectInCreate, ProjectOutput
# from fastapi import HTTPException

# class ProjectService:
#     def __init__(self, session: Session):
#         self.session = session

#     def create_project(self, project_data: ProjectInCreate):
#         newProject = Project(**project_data.model_dump(exclude_none=True))

#         self.session.add(newProject)
#         self.session.commit()
#         self.session.refresh(newProject)

#         return newProject

#     def get_project_by_id(self, id: int) -> Project:
#         project = self.session.query(Project).filter_by(id=id).first()
#         return project

#     def create_new_project(self, project_details: ProjectInCreate) -> ProjectOutput:
#         return self.create_project(project_data=project_details)

#     def get_projects(self):
#         projects = self.session.query(Project).all()
#         return projects

#     def get_project_by_id_service(self, project_id: int):
#         project = self.get_project_by_id(id=project_id)
#         if project:
#             return project
#         raise HTTPException(status_code=404, detail="Project not found")