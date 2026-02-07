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

    # def get_projects(self, owner_id: int):
    #     """Get all projects for a specific user"""
    #     projects = self.session.query(Project).filter_by(owner_id=owner_id).all()
    #     return projects

    def get_projects(self, owner_id: int):
        """Get all projects where user is owner OR has assigned tasks"""
        
        # Get projects owned by user
        owned_projects = self.session.query(Project).filter(
            Project.owner_id == owner_id
        ).all()
        
        # Get projects where user has tasks
        projects_with_tasks = self.session.query(Project).join(Task).filter(
            Task.assignee_id == owner_id
        ).distinct().all()
        
        # Combine and remove duplicates using dictionary
        all_projects_dict = {}
        
        for project in owned_projects:
            all_projects_dict[project.id] = project
        
        for project in projects_with_tasks:
            all_projects_dict[project.id] = project
        
        return list(all_projects_dict.values())
    
    def get_project_by_id_service(self, project_id: int, owner_id: int):
        project = self.session.query(Project).filter_by(
            id=project_id,
            owner_id=owner_id
        ).first()
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if project.owner_id == owner_id:
            return project
        
        has_task = any(task.assignee_id == owner_id for task in project.tasks)
        if has_task:
            return project
        
        # User is neither owner nor has tasks
        raise HTTPException(status_code=403, detail="Access denied")
    
    def is_user_project_member(self, project_id: int, user_id: int, session: Session) -> bool:
        project = session.query(Project).filter_by(id=project_id).first()

        if not project:
            return False
        
        if project.owner_id == user_id:
            return True
        
        for task in project.tasks:
            if task.assignee_id == user_id:
                return True
            
        return False
    
    def delete_project(self, project_id: int, owner_id: int):
        """Delete a project and all its associated tasks"""
        project = self.session.query(Project).filter_by(
            id=project_id,
            owner_id=owner_id
        ).first()
        
        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found or you don't have permission to delete it"
            )
        
        # Delete all tasks associated with the project (cascade is handled by the model)
        self.session.delete(project)
        self.session.commit()
        
        return {"message": "Project deleted successfully"}







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