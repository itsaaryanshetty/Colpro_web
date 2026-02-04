#authentication verifies user identity to ensure only authorized users ca access a resource
#authorization determines user level of access

from fastapi import APIRouter, Depends
from schemas.user import UserInCreate, UserInLogin, UserWithToken, UserOutput
from db import get_db
from sqlalchemy.orm import Session
from services.user_service import UserService

authRouter = APIRouter()

#router calls service to validate user credentials via login method
#router checks token generation and returns token to user upon successful login
@authRouter.post("/login", status_code=200, response_model= UserWithToken)
def login(loginDetails: UserInLogin, session: Session = Depends(get_db)):
    try:
        return UserService(session=session).login(login_details=loginDetails)
    except Exception as error:
        print(error)
        raise error
                                                              
#router calls service to validate uniqueness of email via user_exist_by_email method
@authRouter.post("/signup", status_code=200, response_model= UserOutput)
def signup(signUpDetails: UserInCreate, session: Session = Depends(get_db)):
    try:
        return UserService(session=session).signup(user_details=signUpDetails)
    except Exception as error:
        print(error)
        raise error



# router -> service -> repo -> db
# router <- service <- repo <- db

