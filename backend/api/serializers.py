from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import *
from django.db.models import F


class KeywordSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Keywords
        fields = '__all__'

class UserSerialiser(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    user_keywords = KeywordSerialiser(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id','username', 'email', 'password', 'password2', 'first_name', 'last_name', 'image', 'about_me','user_keywords']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        return user
    


class UserNameSerialiser(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id","username"]
        
class MarkdownTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarkdownText
        fields = ['id', 'content']



class PostSerialiser(serializers.ModelSerializer):
    keywords = serializers.PrimaryKeyRelatedField(queryset=Keywords.objects.all(), many=True)
    authors = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), many=True)
    content = MarkdownTextSerializer()
    creation_user = UserSerialiser(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'subheading', 'content', 
            'keywords', 'link_to_paper', 'authors', 
            'image', 'date_created', 'my_work', 'report_count'
        ]

    def create(self, validated_data):
        keywords_data = validated_data.pop('keywords')
        authors_data = validated_data.pop('authors')
        content_data = validated_data.pop('content')

        content = MarkdownText.objects.create(**content_data)
        

        post = Post.objects.create(content=content, **validated_data)
        

        post.keywords.set(keywords_data)
        post.authors.set(authors_data)

        for keyword in keywords_data:
            Keywords.objects.filter(pk=keyword.pk).update(occurrences=F('occurrences') + 1)

        return post
    


class ReadOnlyPostSerialiser(serializers.ModelSerializer):
    keywords = KeywordSerialiser(many=True, read_only=True)
    authors = UserSerialiser(many=True, read_only=True)
    content = MarkdownTextSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'subheading', 'content', 'keywords', 'link_to_paper', 'authors', 'image','date_created','my_work','report_count']
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

class LinkedPostSerialiser(serializers.ModelSerializer):

    post1 = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    post2 = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = LinkedPost
        fields = ['id','post1', 'post2']

    def create(self, validated_data):
        post1 = validated_data['post1']
        post2 = validated_data['post2']
        linked_post = LinkedPost.objects.create(post1=post1, post2=post2)
        return linked_post


