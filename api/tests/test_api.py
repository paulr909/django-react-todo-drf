import json
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from ..models import Task
from ..serializers import TaskSerializer


class TodoListCreateAPIViewTestCase(APITestCase):
    def setUp(self):
        self.url = "/api/"

    def test_create_task(self):
        response = self.client.post(self.url, {"title": "Clean car"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_tasks(self):
        """
        Verify tasks list
        """
        Task.objects.create(title="Clean the car!")
        Task.objects.create(title="Buy new car!")
        response = self.client.get(self.url)
        self.assertTrue(len(json.loads(response.content)) == Task.objects.count())


class TodoDetailAPIViewTestCase(APITestCase):
    def setUp(self):
        self.task = Task.objects.create(title="Call Lucy")
        self.url = reverse("update", kwargs={"pk": self.task.pk})

    def test_task_object_bundle(self):
        """
        Verify task object bundle
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        task_serializer_data = TaskSerializer(instance=self.task).data
        response_data = json.loads(response.content)
        self.assertEqual(task_serializer_data, response_data)

    def test_task_object_update(self):
        response = self.client.put(self.url, {"title": "Call Lucy"})
        response_data = json.loads(response.content)
        task = Task.objects.get(id=self.task.id)
        self.assertEqual(response_data.get("title"), task.title)

    def test_task_object_partial_update(self):
        response = self.client.patch(self.url, {"completed": True})
        response_data = json.loads(response.content)
        task = Task.objects.get(id=self.task.id)
        self.assertEqual(response_data.get("completed"), task.completed)

    def test_task_object_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
