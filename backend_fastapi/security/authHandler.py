import jwt
from dotenv import load_dotenv
import os
import time

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")

print(f"DEBUG: JWT_SECRET loaded = {JWT_SECRET[:10]}... (length: {len(JWT_SECRET) if JWT_SECRET else 0})")
print(f"DEBUG: JWT_ALGORITHM = {JWT_ALGORITHM}")

class AuthHandler(object):
    # this method is to create a jwt token 
    @staticmethod
    def sign_jwt(user_id: int) -> str:
        payload = {
            "user_id": user_id,
            "expires": time.time() +86400
        }

        token = jwt.encode(payload, JWT_SECRET, algorithm = JWT_ALGORITHM)
        return token

    #this one is to decode a jwt token 
    @staticmethod
    def decode_jwt(token: str) -> dict:
        try:
            decoded_token = jwt.decode(token, JWT_SECRET, algorithms = [JWT_ALGORITHM])

            # Check expiration
            if decoded_token.get('expires') and decoded_token['expires'] >= time.time():
                return decoded_token
            else:
                print("Token has expired")
                return None
        except jwt.ExpiredSignatureError:
            print("Token signature has expired")
            return None
        except jwt.InvalidTokenError as e:
            print(f"Invalid token: {e}")
            return None
        except Exception as e:
            print(f"Unable to decode token: {e}")
            return None



