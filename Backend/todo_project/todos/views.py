from django.shortcuts import render
from rest_framework import viewsets, permissions, generics
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer, RegisterSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]  # anyone can register

class IsOwner(permissions.BasePermission):
    """
    Custom permission: only allow owners to view/edit tasks
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        # Only return tasks of the logged-in user
        return Task.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Automatically assign the task to the logged-in user
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['put'])
    def mark_completed(self, request, pk=None):
        task = self.get_object()
        task.completed = True
        task.save()
        return Response(self.get_serializer(task).data)
    
    @action(detail=True, methods=['put'])
    def mark_incomplete(self, request, pk=None):
        task = self.get_object()
        task.completed = False
        task.save()
        return Response(self.get_serializer(task).data)