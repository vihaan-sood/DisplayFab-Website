from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, filters

from .serializers import *
from rest_framework.permissions import *

from .models import *

from django.db.models import F



# Create your views here.


class PostListView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerialiser
    permission_classes = [IsAuthenticatedOrReadOnly]    

class PostDelete(generics.DestroyAPIView):
    serializer_class = PostSerialiser
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(author=user)
    
class PostCreate(generics.CreateAPIView):
    serializer_class = PostSerialiser
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        post = serializer.save(creation_user=self.request.user)
        for keyword in post.keywords.all():
            Keywords.objects.filter(key_id=keyword.key_id).update(occurances=F('occurances') + 1)

class PostDetails(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerialiser
    permission_classes = [IsAuthenticatedOrReadOnly]    

    def get(self, request, *args, **kwargs):
        
        return super().get(request, *args, **kwargs)



    

class MakeUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerialiser
    permission_classes = [AllowAny]


class ShowKeywords(generics.ListAPIView):
    queryset = Keywords.objects.all()
    serializer_class = KeywordSerialiser
    filter_backends = [filters.SearchFilter]
    search_fields = ['word']

class ShowUsers(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserNameSerialiser
    filter_backends = [filters.SearchFilter]
    search_fields = ['username']

class UserDetails(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerialiser
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        return self.queryset.get(pk=self.kwargs['pk'])
    

class MarkdownPage(generics.CreateAPIView):
    queryset = MarkdownText.objects.all()
    serializer_class = MarkdownTextSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class MarkdownPageDetails(generics.RetrieveAPIView):
    queryset = MarkdownText.objects.all()
    serializer_class = MarkdownTextSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class KeywordCreate(generics.CreateAPIView):
    queryset = Keywords.objects.all()
    serializer_class = KeywordSerialiser

class BookmarkDetails(generics.RetrieveAPIView):

    queryset = UserBookmarks.objects.all()
    serializer_class = BookmarkSerialiser
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        return self.queryset.get(pk=self.kwargs['pk'])

