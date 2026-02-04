from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserInCreate, UserInLogin, UserOutput, UserWithToken

from security.authHandler import AuthHandler
from security.hashHelper import HashHelper
from fastapi import HTTPException

class UserService:
    def __init__(self, session: Session):
        self.session = session

    def create_user(self, user_data: UserInCreate):
        newUser = User(**user_data.model_dump(exclude_none=True))

        self.session.add(newUser)
        self.session.commit()
        self.session.refresh(newUser)

        return newUser

    def user_exist_by_email(self, email: str) -> bool:
        user = self.session.query(User).filter_by(email=email).first()
        return bool(user)

    def get_user_by_email(self, email: str) -> User:
        user = self.session.query(User).filter_by(email=email).first()
        return user
    
    def get_user_by_id(self, id: int) -> User:
        user = self.session.query(User).filter_by(id=id).first()
        return user
 #-----------------------------------------------------------------------------------------------------------------   
    
#this function calls out user_exist_by_email to check if email is already registered
    def signup(self, user_details: UserInCreate) -> UserOutput:
        if self.user_exist_by_email(email=user_details.email):
            raise HTTPException(status_code=400, detail="Please login")
        
        hashed_password = HashHelper.get_password_hash(plain_password=user_details.password)
        user_details.password = hashed_password #so that plain password is not stored in db
        return self.create_user(user_data = user_details)
    
#this function calls out user_exist_by_email to check if email is registered    
    def login(self, login_details: UserInLogin) -> UserWithToken:
        if not self.user_exist_by_email(email=login_details.email):
            raise HTTPException(status_code=400, detail="Please create an account")
        
        user = self.get_user_by_email(email=login_details.email)
        if HashHelper.verify_password(plain_password=login_details.password, hashed_password=user.password):
            token = AuthHandler.sign_jwt(user_id=user.id)
            if token: 
                return UserWithToken(token=token) #sends token to frontend, where it will store it in local storage
            raise HTTPException(status_code=500, detail="Unable to process request")
        raise HTTPException(status_code=400, detail="Please check ur credentials")
    
    def get_user_by_id_service(self, user_id: int):
        user = self.get_user_by_id(id=user_id)
        if user:
            return user
        raise HTTPException(status_code=400, detail="User isnt available")