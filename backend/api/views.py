from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import *



# Create your views here.


class PostListView(generics.ListCreateAPIView):
    serializer_class = PostSerialiser
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Post.objects.all()  ##to show notes written by only user, use Post.objects.filter(author=user)
    
  


    

class MakeUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerialiser
    permission_classes = [AllowAny]