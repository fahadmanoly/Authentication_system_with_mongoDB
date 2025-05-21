from pymongo import MongoClient

mongo_URI = "mongodb://localhost:27017/"
db_name = "users_db"

client = MongoClient(mongo_URI)
db = client[db_name]

def get_collection():
    return db["users"]




