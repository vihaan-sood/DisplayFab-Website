from django.urls import path
from . import views

urlpatterns = [

    path("api/posts/",views.PostListView.as_view(),name="posts_list"),
    path("posts/delete/<int:pk>/", views.PostDelete.asview(),name="post_delete")


]