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
    path("api/register/",MakeUserView.as_view(),name="signup"),
    path("api/token/", TokenObtainPairView.as_view(), name = "obtain_token" ),
    path("api/token/refresh/", TokenRefreshView.as_view(), name = "refresh_token"),
    path("api-auth/", include("rest_framework.urls")),

    path("api/user/myprofile/<int:pk>/",UserDetails.as_view(),name="user_details"),
    path("api/user/currentuser/",CurrentUser.as_view(),name="user_details"),
    path("api/posts/create/",PostCreate.as_view(),name="post_create"),
    path('api/markdowntext/create/', MarkdownPageCreate.as_view(), name='markdowntext-create'),

    path("api/posts/",PostListView.as_view(),name="posts_list"),
    path("api/posts/<int:pk>/",PostDetails.as_view(),name="posts_expanded"),
    path("api/posts/userspecific/<int:pk>/",UserProfilePosts.as_view(),name="user_profile_posts"),

    path('api/markdowntext/<int:pk>/', MarkdownPageDetails.as_view(), name='markdown-page'),
    path("api/posts/delete/<int:pk>/", PostDelete.as_view(),name="post_delete"),
    

    path("api/keywords/",ShowKeywords.as_view(),name='show_keywords'),
    path('api/keywords/create/', KeywordCreate.as_view(), name='keyword_create'),


    path("api/authors/",ShowUsers.as_view(),name='show_users'),

    path('api/user/bookmarks/create/', UserBookmarksCreateView.as_view(), name='user_bookmarks_create'),
    path('api/user/bookmarks/<int:pk>/', UserBookmarksListView.as_view(), name='bookmark_detail'),
    

    

  

] + static(settings.MEDIA_URL,document_root = settings.MEDIA_ROOT)
