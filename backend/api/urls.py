from django.urls import path
from . import views

urlpatterns = [

    path("posts/",views.PostListView,name="posts_list")


]