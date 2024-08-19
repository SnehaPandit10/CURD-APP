from django.urls import path
from .views import LogIn, SignUp,Task

urlpatterns = [
    path('login/', LogIn.as_view(), name="login"),
    path('signup/', SignUp.as_view(), name="signup"),
    path('task/', Task.as_view(), name="task"),

]