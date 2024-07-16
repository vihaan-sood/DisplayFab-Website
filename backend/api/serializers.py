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
    content = MarkdownTextSerializer(read_only=True)  # Ensure this is nested correctly


    
    class Meta:
        model = Post
        fields = ['id','title', 'subheading', 'content', 'keywords', 'link_to_paper', 'authors', 'image']


    def create(self, validated_data):
        keywords_data = validated_data.pop('keywords')
        authors_data = validated_data.pop('authors')
        post = Post.objects.create(**validated_data)
        post.keywords.set(keywords_data)
        post.authors.set(authors_data)
        return post

