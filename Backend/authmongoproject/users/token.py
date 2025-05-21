# yourapp/tokens.py
from rest_framework_simplejwt.tokens import RefreshToken
from bson import ObjectId
from database import get_collection

class MongoRefreshToken(RefreshToken):
    @classmethod
    def user_mongo(cls, user):
        token = cls()
        token['user_id'] = str(user["_id"])
        return token  

