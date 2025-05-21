from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.hashers import check_password
from bson.objectid import ObjectId
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from rest_framework.exceptions import NotFound
from .token import MongoRefreshToken


from .serializers import LoginSerializer, UserSerializer
from database import get_collection


class UserCreate(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        serializer = UserSerializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
        
    
    
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_id = request.user._id
        if user_id:
            user_collection = get_collection()
            user = user_collection.find_one({"_id":ObjectId(user_id)})
            if user:
                serializer = UserSerializer(user)
                return Response(serializer.data)
            raise NotFound("User profile not found")
        else:
            return Response({"error" : "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)
        
        

    
    
    def put(self,request):
        user_collection = get_collection()
        try:
            user_id = request.user._id
            user = user_collection.find_one({"_id" : ObjectId(user_id)})
           
            if not user:
                return Response(status=status.HTTP_404_NOT_FOUND)
            serializer = UserSerializer(instance=user, data=request.data, partial = True)
            if serializer.is_valid():
                updated_data = {k: v for k, v in serializer.validated_data.items()}
                result = user_collection.update_one({"_id": ObjectId(user_id)}, {"$set": updated_data})
                if result.modified_count > 0:
                    updated_user = user_collection.find_one({"_id": ObjectId(user_id)})
                    return Response(UserSerializer(updated_user).data)
                else:
                    return Response({"message": "No changes applied."}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error":"Invalid User ID"}, status=status.HTTP_400_BAD_REQUEST)

    

    
class UserLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        serializer = LoginSerializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')
            user_collection = get_collection()
            user = user_collection.find_one({"username": username})
        
            if user:
                if check_password(password, user.get('password', '')):
                    refresh = RefreshToken()
                    refresh['user_id'] = str(user['_id'])
                    print(str(refresh))
                    return Response({'refresh' : str(refresh), 'access' : str(refresh.access_token)})
                else:
                    raise ValueError("Invalid credentials")
            else:
                return Response({"error" : "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            try:
                
                token = RefreshToken(refresh_token)
                print(f"RefreshToken object created: {token}")
                user_id = request.user._id
                print("the user id is", user_id)
                token['user_id'] = user_id
                print("the token is ",token)
                token.blacklist()
                print("success")
                return Response({"detail": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
            except Exception as e:
                print(f"Error creating/blacklisting token: {e}")
                return Response({"error": f"Invalid refresh token: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            
            
            
    
    
          
    
            
