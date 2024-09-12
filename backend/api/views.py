from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, filters, views, response, status

from .serializers import *
from rest_framework.permissions import *

from .models import *

from django.db.models import F

from django.shortcuts import get_object_or_404

from rest_framework.exceptions import ValidationError





# Create your views here.


class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = ReadOnlyPostSerialiser
    permission_classes = [AllowAny]   
    search_fields = ['title'] 

    def get_queryset(self):
        # Return only posts where is_moderated is True
        return Post.objects.filter(is_moderated=True)

class PostDelete(generics.DestroyAPIView):
    serializer_class = PostSerialiser
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(creation_user=user)
    
class PostCreate(generics.CreateAPIView):
    serializer_class = PostSerialiser
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(creation_user=self.request.user)
        
class PostDetails(generics.RetrieveAPIView):
    serializer_class = ReadOnlyPostSerialiser
    permission_classes = [AllowAny]    

    def get_queryset(self):
        return Post.objects.filter(is_moderated=True)
    

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

    def create(self, request, *args, **kwargs):
        # Extract the 'word' field from the request data
        word = request.data.get('word', '').strip()

        # Check if the keyword already exists
        if Keywords.objects.filter(word__iexact=word).exists():
            return response.Response(
                {'message': 'Keyword already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # If the keyword does not exist, proceed with the creation
        return super().create(request, *args, **kwargs)


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
        return UserBookmark.objects.filter(user=user_id, post__is_moderated=True)

class UserProfilePosts(generics.ListAPIView):
    serializer_class = ReadOnlyPostSerialiser
    permission_classes = [AllowAny] 

    def get_queryset(self):
        author_id = self.kwargs['pk']
        author = get_object_or_404(CustomUser, pk=author_id)
        return Post.objects.filter(authors=author, is_moderated=True)
    
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
        return LinkedPost.objects.filter(post1=post_id, post1__is_moderated=True)
    
class LinkedPostCreateView(generics.CreateAPIView):
    serializer_class = LinkedPostSerialiser
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

class LinkedPostDeleteView(generics.DestroyAPIView):
    """
    DELETE: Delete a linked post by its ID.
    """
    def delete(self, request, post1_id, post2_id):
        
        try:
            # Find the linked post and delete it
            linked_post = LinkedPost.objects.filter(post1_id=post1_id, post2_id=post2_id).first()

            if linked_post:
                linked_post.delete()
                return response.Response({"message": "Link deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
            else:
                return response.Response({"error": "Linked post not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return response.Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyEmailView(views.APIView):
    permission_classes = [AllowAny]  
    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            verification_code = serializer.validated_data['verification_code']
            
            try:
                user = CustomUser.objects.get(email=email)
                
                if user.verification_code == verification_code:
                    user.is_active = True
                    user.verification_code = 0  # Clear the verification code
                    user.save()
                    return response.Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)
                else:
                    return response.Response({"error": "Invalid verification code."}, status=status.HTTP_400_BAD_REQUEST)
            
            except CustomUser.DoesNotExist:
                return response.Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)
            
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateAboutMeView(views.APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UpdateAboutMeSerialiser(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_200_OK)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MyPosts(generics.ListAPIView):
    serializer_class = ReadOnlyPostSerialiser
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(creation_user=self.request.user,is_moderated=True)
    
class MarkdownPageUpdate(generics.UpdateAPIView):
    queryset = MarkdownText.objects.all()
    serializer_class = MarkdownTextSerializer
    permission_classes = [IsAuthenticated]

class PostUpdate(generics.UpdateAPIView):
    queryset = Post.objects.all() 
    serializer_class = PostSerialiser  
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(creation_user=user, is_moderated=True)

class UserBookmarksDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only allow users to delete their own bookmarks
        user = self.request.user
        return UserBookmark.objects.filter(user=user)

    def delete(self,request, *args, **kwargs):
        bookmark_id = self.kwargs.get('pk')
        try:
            bookmark = self.get_queryset().get(id=bookmark_id)
            bookmark.delete()
            return response.Response({'message': 'Bookmark deleted successfully.'})
        except UserBookmark.DoesNotExist:
            raise response.Response({'message': 'Bookmark deletion unsuccesful: permission denied'})
        
