from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

class UserSerialiser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
    
class PostSerialiser(serializers.ModelSerializer):
   
        
    class Meta:
        model = Post
        fields = ["id","title","content","keywords","link_to_paper","authors","image","subheading"]

class KeywordSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Keywords
        fields = '__all__'

class UserNameSerialiser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username"]
        
      