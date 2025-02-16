"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


from api.views import *

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView





urlpatterns = [
   path('admin/', admin.site.urls),
    path("api/authors/", ShowUsers.as_view(), name='show_users'),
    path("api/register/", MakeUserView.as_view(), name="signup"),
    path("api/token/", TokenObtainPairView.as_view(), name="obtain_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),

    path("api-auth/", include("rest_framework.urls")),
    path("api/keywords/", ShowKeywords.as_view(), name='show_keywords'),
    path('api/keywords/create/', KeywordCreate.as_view(), name='keyword_create'),

    path('api/markdowntext/<int:pk>/', MarkdownPageDetails.as_view(), name='markdown-page'),
    path('api/markdowntext/<int:pk>/edit/', MarkdownPageUpdate.as_view(), name="markdown_update"),
    path('api/markdowntext/create/', MarkdownPageCreate.as_view(), name='markdowntext-create'),

    path("api/posts/", PostListView.as_view(), name="posts_list"),
    path("api/posts/<int:pk>/", PostDetails.as_view(), name="posts_expanded"),
    path("api/posts/<int:pk>/report/", ReportPostView.as_view(), name='report_post'),
    path("api/posts/create/", PostCreate.as_view(), name="post_create"),
    path("api/posts/delete/<int:pk>/", PostDelete.as_view(), name="post_delete"),
    path('api/posts/linked/<int:pk>/', LinkedPostListView.as_view(), name='linked_posts'),
    path('api/posts/linked/create/', LinkedPostCreateView.as_view(), name='linked_post_create'),
    path('api/posts/linked/delete/<int:post1_id>/<int:post2_id>/', LinkedPostDeleteView.as_view(), name='linked_post_delete'),
    path('api/posts/myposts/', MyPosts.as_view(), name="my_posts"),
    path("api/posts/userspecific/<int:pk>/", UserProfilePosts.as_view(), name="user_profile_posts"),
    path('api/posts/<int:pk>/edit/', PostUpdate.as_view(), name='post_edit'),


    path('api/user/bookmarks/create/', UserBookmarksCreateView.as_view(), name='user_bookmarks_create'),
    path('api/user/bookmarks/<int:pk>/', UserBookmarksListView.as_view(), name='bookmark_detail'),
    path('api/user/bookmarks/<int:pk>/delete/',UserBookmarksDeleteView.as_view(),name='bookmark_delete'),
    path("api/user/currentuser/", CurrentUser.as_view(), name="user_details"),
    path('api/user/update-about-me/', UpdateAboutMeView.as_view(), name='update_about_me'),
    path("api/user/myprofile/<int:pk>/", UserDetails.as_view(), name="user_details"),
    path("api/user/update-details/",UpdateUserDetails.as_view(),name="user_details_update"),
    

    path("api/users/", ReadOnlyUserDetails.as_view(), name="all_users"),
    path('api/verifyemail/', VerifyEmailView.as_view(), name='verify_email'),


    

  

] + static(settings.MEDIA_URL,document_root = settings.MEDIA_ROOT)
