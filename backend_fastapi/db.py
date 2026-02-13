from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
#sessionmaker helps perform actions on the database
#auto flush and autocommit is false so after each transaction, the changes are committed to the database

Base = declarative_base() #helps create tables

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

#this includes the initialization of the tables 
def create_tables():
    Base.metadata.create_all(bind=engine)

