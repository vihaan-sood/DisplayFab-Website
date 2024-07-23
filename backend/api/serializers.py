from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

class UserSerialiser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password","email","first_name","last_name"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
    


class KeywordSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Keywords
        fields = '__all__'

class UserNameSerialiser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username"]
        
class MarkdownTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarkdownText
        fields = ['id', 'content']



class PostSerialiser(serializers.ModelSerializer):
    keywords = serializers.PrimaryKeyRelatedField(queryset=Keywords.objects.all(), many=True)
    authors = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)
    content = MarkdownTextSerializer()
    creation_user = UserSerialiser(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'subheading', 'content', 'keywords', 'link_to_paper', 'authors', 'image', 'creation_user']

    def create(self, validated_data):
        keywords_data = validated_data.pop('keywords')
        authors_data = validated_data.pop('authors')
        content_data = validated_data.pop('content')

        content = MarkdownText.objects.create(**content_data)
        post = Post.objects.create(content=content, **validated_data)
        post.keywords.set(keywords_data)
        post.authors.set(authors_data)
        return post

class ReadOnlyPostSerialiser(serializers.ModelSerializer):
    keywords = KeywordSerialiser(many=True, read_only=True)
    authors = UserSerialiser(many=True, read_only=True)
    content = MarkdownTextSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'subheading', 'content', 'keywords', 'link_to_paper', 'authors', 'image']
        read_only_fields = fields


class BookmarkSerialiser(serializers.ModelSerializer):

    user = UserSerialiser(read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = UserBookmark
        fields = ['id','user', 'post']

    def create(self, validated_data):
        user = self.context['request'].user
        post = validated_data['post']
        user_bookmark = UserBookmark.objects.create(user=user, post=post)
        return user_bookmark


# class BookmarkSerialiser(serializers.ModelSerializer):

#     post_ids = serializers.PrimaryKeyRelatedField(many=True, queryset=Post.objects.all(), write_only=True)

#     class Meta:
#         model = UserBookmarks
#         fields = ['id', 'user_id', 'post_ids']

#     def create(self, validated_data):
#         posts = validated_data.pop('post_ids')
#         user = self.context['request'].user
#         user_bookmark, created = UserBookmarks.objects.get_or_create(user_id=user)
#         user_bookmark[0].posts.set(posts)
#         return user_bookmark