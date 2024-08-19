from django.db import models
from django.contrib.auth.models import User


class TaskModel(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=225)
    status = models.BooleanField(default=False)
    due_date =models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')