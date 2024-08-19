from django.shortcuts import render
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from .models import TaskModel
from .serializers import TaskSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class SignUp(APIView):
    def post(self,request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        user = User.objects.create_user(username=username,email=email,password=password)
        return Response({'message':'User created successfully'},status=201)

class LogIn(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        try:
            user_obj = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"message": "User not found!"}, status=404)

        if user_obj.check_password(password):
            refresh = RefreshToken.for_user(user_obj)
            access_token = str(refresh.access_token)
            return Response(
                {"message": "User logged in successfully!", "token": access_token, "username": user_obj.username},
                status=200,
            )
        else:
            return Response({"message": "Invalid credentials!"}, status=401)


class Task(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        title = request.data.get('title')
        description = request.data.get('description')
        status=request.data.get('status')
        due_date=request.data.get('due_date')
        username=request.data.get('username')
        user_obj = User.objects.get(username=username)
        task = TaskModel.objects.create(title=title,description=description,status=status,due_date=due_date,user=user_obj)
        return Response({'message':'Task created successfully'},status=201)

    def get(self,request):
        tasks = TaskModel.objects.filter(user_id=request.user.id)
        serializer = TaskSerializer(tasks,many=True)
        return Response({'tasks':serializer.data},status=200)

    def put(self,request):
        id = request.data.get('id')
        title = request.data.get('title')
        description = request.data.get('description')
        status=request.data.get('status')
        due_date=request.data.get('due_date')
        task_obj = TaskModel.objects.get(id=id)
        task_obj.title = title
        task_obj.description = description
        task_obj.status=status
        task_obj.due_date=due_date
        task_obj.save()
        return Response({'message':'Task updated successfully'},status=200)

    def delete(self,request):
        id = request.data.get('id')
        task_obj = TaskModel.objects.get(id=id)
        task_obj.delete()
        return Response({'message':'Task deleted successfully'},status=200)
