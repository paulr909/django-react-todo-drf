from django.urls import path
from api.views import TaskListCreateAPIView, TaskRetrieveUpdateDestroyAPIView

urlpatterns = [
    path("", TaskListCreateAPIView.as_view()),
    path("create", TaskListCreateAPIView.as_view(), name="create"),
    path("strike/<str:pk>/", TaskRetrieveUpdateDestroyAPIView.as_view(), name="strike"),
    path("update/<str:pk>/", TaskRetrieveUpdateDestroyAPIView.as_view(), name="update"),
    path("delete/<str:pk>/", TaskRetrieveUpdateDestroyAPIView.as_view(), name="delete"),
]
