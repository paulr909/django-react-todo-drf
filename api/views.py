from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

from .models import Task
from .serializers import TaskSerializer


class TaskListCreateAPIView(ListCreateAPIView):
    queryset = Task.objects.all().order_by("-id")
    serializer_class = TaskSerializer


class TaskRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
