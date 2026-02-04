from pydantic import EmailStr, BaseModel
from typing import Literal, Union

class UserInCreate(BaseModel): # creating a new user
    first_name: str
    last_name: str
    email: EmailStr
    role: Literal["Member", "Admin"]
    password: str #this one will be hashed later 

class UserOutput(BaseModel): #sending user data to client without password
    id: int
    first_name: str
    last_name: str
    role: Literal["Member", "Admin"]
    email: EmailStr

class UserInUpdate(BaseModel): #updating user data
    id: int                                                    
    first_name: str | None = None #Union[str, None] = None -> can also be used
    last_name: str | None = None
    email: Union[EmailStr, None] = None
    password: str|None = None


class UserInLogin(BaseModel): #login details provided by user
    email : EmailStr
    password : str

class UserWithToken(BaseModel): #provide this to user when the login is successful
    token : str          #sending JWT token upon successful login