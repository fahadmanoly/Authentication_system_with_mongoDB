from rest_framework_simplejwt.authentication import JWTAuthentication
from bson import ObjectId
from database import get_collection



class MongoUser:
    def __init__(self, user_data):
        self._id = str(user_data["_id"])
        self.username = user_data.get("username", "")
        self.first_name = user_data.get("first_name", "")
        self.last_name = user_data.get("last_name", "")
        self.email = user_data.get("email", "")
        self.is_authenticated = True
        
    def __str__(self):
        return self.username
    

class MongoJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get("user_id")
        if not user_id:
            raise ValueError("Token does not contain user_id")
        
        user_collection = get_collection()
        user = user_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise ValueError("User not found")
        return MongoUser(user)
    
    