from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from database import get_collection




class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only = True)
    username = serializers.CharField(max_length = 100)
    first_name = serializers.CharField(max_length = 100)
    last_name = serializers.CharField(max_length = 100)
    email = serializers.EmailField(max_length= 100)
    password = serializers.CharField(style={'input_type': 'password'}, write_only = True)
    confirm_password = serializers.CharField(style={'input_type': 'password'}, write_only = True)
    
    
    def validate_username(self,value):
        users_collection = get_collection()
        if users_collection.find_one({"username":value}):
            raise serializers.ValidationError("A user with that username already exists.")
        return value
    
    def validate_passwords(self,data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    
    def create(self, validated_data):
        users_collection = get_collection()
        password = validated_data.pop('password')
        validated_data.pop('confirm_password')
        hashed_password = make_password(password)
        user_data = {**validated_data, 'password': hashed_password}
        result = users_collection.insert_one(user_data)
        created_user = users_collection.find_one({"_id": result.inserted_id})
        created_user['id'] = str(created_user.pop('_id'))
        return created_user

    def update(self, instance, validated_data):
        users_collection = get_collection()
        password = validated_data.get('password')
        confirm_password = validated_data.get('confirm_password')
        validated_data.pop('username', None)
        
        if password and confirm_password:
            if password != confirm_password:
                raise serializers.ValidationError("Entered passwords do not match, please try again.")
            validated_data['password'] = make_password(password)

            validated_data.pop('confirm_password', None)
            users_collection.update_one({"_id": instance['_id']}, {"$set": validated_data})
            updated_user = users_collection.find_one({"_id": instance['_id']})
            updated_user['id'] = str(updated_user.pop('_id'))
            return updated_user
        else:
            raise ValueError("Please enter passwords")
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, required=True)
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True, required=True)
    
    