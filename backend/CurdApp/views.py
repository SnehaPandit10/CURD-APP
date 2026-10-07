from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User

from .models import TaskModel
from .serializers import TaskSerializer


class SignUp(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not password:
            return Response({"message": "Username and password are required."}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({"message": "That username is already taken."}, status=400)

        User.objects.create_user(username=username, email=email, password=password)
        return Response({"message": "User created successfully"}, status=201)


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
            return Response(
                {
                    "message": "User logged in successfully!",
                    "token": str(refresh.access_token),
                    "username": user_obj.username,
                },
                status=200,
            )
        return Response({"message": "Invalid credentials!"}, status=401)


class Task(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        TaskModel.objects.create(
            title=request.data.get("title"),
            description=request.data.get("description"),
            status=request.data.get("status", False),
            due_date=request.data.get("due_date"),
            user=request.user,  # taken from the token, not from the request body
        )
        return Response({"message": "Task created successfully"}, status=201)

    def get(self, request):
        tasks = TaskModel.objects.filter(user=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response({"tasks": serializer.data}, status=200)

    def put(self, request):
        try:
            task_obj = TaskModel.objects.get(id=request.data.get("id"), user=request.user)
        except TaskModel.DoesNotExist:
            return Response({"message": "Task not found"}, status=404)

        task_obj.title = request.data.get("title")
        task_obj.description = request.data.get("description")
        task_obj.status = request.data.get("status")
        task_obj.due_date = request.data.get("due_date")
        task_obj.save()
        return Response({"message": "Task updated successfully"}, status=200)

    def delete(self, request):
        try:
            task_obj = TaskModel.objects.get(id=request.data.get("id"), user=request.user)
        except TaskModel.DoesNotExist:
            return Response({"message": "Task not found"}, status=404)

        task_obj.delete()
        return Response({"message": "Task deleted successfully"}, status=200)