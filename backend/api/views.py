from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, filters, views, response, status

from .serializers import *
from rest_framework.permissions import *

from .models import *

from django.db.models import F

from django.shortcuts import get_object_or_404

from django.http import JsonResponse

from .moderator import moderate_content




# Create your views here.


class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = ReadOnlyPostSerialiser
    permission_classes = [AllowAny]   
    search_fields = ['title'] 

class PostDelete(generics.DestroyAPIView):
    serializer_class = PostSerialiser
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(author=user)
    
class PostCreate(generics.CreateAPIView):
    serializer_class = PostSerialiser
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(creation_user=self.request.user)
        
class PostDetails(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = ReadOnlyPostSerialiser
    permission_classes = [AllowAny]    

    def get(self, request, *args, **kwargs):
        
        return super().get(request, *args, **kwargs)

class ReportPostView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerialiser

    def update(self, request, *args, **kwargs):
        try:
            post = self.get_object()
            user = request.user

            if Report.objects.filter(user=user, post=post).exists():
                return response.Response({"error": "You have already reported this post."}, status=status.HTTP_400_BAD_REQUEST)
  
            Report.objects.create(user=user, post=post)

            post.report_count += 1
            post.save()

            return response.Response({"message": "Report submitted successfully!"}, status=status.HTTP_200_OK)

        except Post.DoesNotExist:
            return response.Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    

class MakeUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerialiser
    permission_classes = [AllowAny]


class ShowKeywords(generics.ListAPIView):
    queryset = Keywords.objects.all()
    serializer_class = KeywordSerialiser
    filter_backends = [filters.SearchFilter]
    search_fields = ['word']

class ShowUsers(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserNameSerialiser
    filter_backends = [filters.SearchFilter]
    search_fields = ['username']

class UserDetails(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerialiser
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        return self.queryset.get(pk=self.kwargs['pk'])
    
class ReadOnlyUserDetails(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerialiser
    permission_classes = [AllowAny]

    

class MarkdownPageCreate(generics.CreateAPIView):
    queryset = MarkdownText.objects.all()
    serializer_class = MarkdownTextSerializer
    permission_classes = [AllowAny]

class MarkdownPageDetails(generics.RetrieveAPIView):
    queryset = MarkdownText.objects.all()
    serializer_class = MarkdownTextSerializer
    permission_classes = [AllowAny]


class KeywordCreate(generics.CreateAPIView):
    queryset = Keywords.objects.all()
    serializer_class = KeywordSerialiser



class UserBookmarksCreateView(generics.CreateAPIView):
    serializer_class = BookmarkSerialiser
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        post = serializer.validated_data['post']
        
   
        if UserBookmark.objects.filter(user=user, post=post).exists():
            return response.Response({"error": "Bookmark already exists!"}, status=status.HTTP_400_BAD_REQUEST)
        

        serializer.save(user=user)

class UserBookmarksListView(generics.ListAPIView):
    serializer_class = BookmarkSerialiser
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return UserBookmark.objects.filter(user=user_id)

class UserProfilePosts(generics.ListAPIView):
    serializer_class = ReadOnlyPostSerialiser
    permission_classes = [AllowAny] 

    def get_queryset(self):
        author_id = self.kwargs['pk']
        author = get_object_or_404(CustomUser, pk=author_id)
        return Post.objects.filter(authors=author)
    
class CurrentUser(generics.RetrieveAPIView):
    serializer_class = UserSerialiser
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class LinkedPostListView(generics.ListAPIView):
    serializer_class = LinkedPostSerialiser
    permission_classes = [AllowAny]

    def get_queryset(self):
        post_id  = self.kwargs['pk']
        return LinkedPost.objects.filter(post1=post_id)
    
class LinkedPostCreateView(generics.CreateAPIView):
    serializer_class = LinkedPostSerialiser
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

