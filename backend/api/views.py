from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics

from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import *



# Create your views here.


class PostListView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerialiser
    permission_classes = [IsAuthenticated]

    
    

class PostDelete(generics.DestroyAPIView):
    serializer_class = PostSerialiser
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(author=user)
    
class PostCreate(generics.CreateAPIView):
    serializer_class = PostSerialiser
    permission_classes = [IsAuthenticated]
    
  


    

class MakeUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerialiser
    permission_classes = [AllowAny]


class ShowKeywords(generics.ListAPIView):
    queryset = Keywords.objects.all()
    serializer_class = KeywordSerialiser

class ShowUsers(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserNameSerialiser

