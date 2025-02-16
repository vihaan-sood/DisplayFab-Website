from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import *
from django.db.models import F
import os
from .emails import *


class KeywordSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Keywords
        fields = '__all__'

class UserSerialiser(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=False)
    user_keywords = KeywordSerialiser(many=True,required= False)

    class Meta:
        model = CustomUser
        fields = ['id','username', 'email', 'password', 'password2', 'first_name', 'last_name', 'image', 'about_me','user_keywords']

    def validate(self, attrs):
        if 'password' in attrs and 'password2' in attrs:
            if attrs['password'] != attrs['password2']:
                raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        send_email_code(user.email)
        return user
    
class UserUpdateSerialiser(serializers.ModelSerializer):
    user_keywords = serializers.PrimaryKeyRelatedField(queryset=Keywords.objects.all(), many=True, required=False)
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'image', 'about_me', 'user_keywords']

    def update(self, instance, validated_data):
        user_keywords = validated_data.pop('user_keywords', None)

        image = validated_data.pop('image', None)
        if image:
            # Delete old image if it exists
            if instance.image:
                old_image_path = instance.image.url
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)
            instance.image = image

        # Update the other fields
        for field, value in validated_data.items():
            setattr(instance, field, value)

        # Update the user's keywords if provided
        if user_keywords:
            instance.user_keywords.set(user_keywords)

        instance.save()
        return instance


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
    content = serializers.PrimaryKeyRelatedField(queryset=MarkdownText.objects.all())
    creation_user = UserSerialiser(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'subheading', 'content', 
            'keywords', 'link_to_paper', 'authors', 
            'image', 'date_created', 'my_work', 'report_count', 'creation_user'
        ]

    def create(self, validated_data):
 
        keywords_data = validated_data.pop('keywords')
        authors_data = validated_data.pop('authors')
        validated_data.pop('creation_user', None)
   

        request = self.context.get('request')
        creation_user = request.user

        post = Post.objects.create(
            creation_user=creation_user, 
            **validated_data
        )

        

        post.keywords.set(keywords_data)
        post.authors.set(authors_data)

        for keyword in keywords_data:
            Keywords.objects.filter(pk=keyword.pk).update(occurances=F('occurances') + 1)

        new_post_email(post.id)

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


class EmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    verification_code = serializers.IntegerField()

    def validate(self, data):
        try:
            user = CustomUser.objects.get(email=data['email'])
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")

        if user.verification_code != data['verification_code']:
            raise serializers.ValidationError("Invalid verification code.")

        return data
    
class UpdateAboutMeSerialiser(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['about_me']