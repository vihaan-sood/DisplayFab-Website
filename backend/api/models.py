from django.db import models
from django.contrib.auth.models import User




# Create your models here.

class Keywords(models.Model): 
    key_id = models.AutoField(primary_key=True)
    word = models.CharField(max_length=15)
    IsRegistered = models.BooleanField(null= True)
    occurances = models.IntegerField(default=0)

    def __str__(self):
        return self.word

class MarkdownText(models.Model):
    id = models.AutoField(primary_key=True)
    content = models.TextField()

class Post(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length = 100)
    subheading = models.CharField(max_length=250, null=True)
    content = models.ForeignKey(MarkdownText,on_delete=models.SET_NULL,null=True)                                                       #markdown here
    keywords = models.ManyToManyField(Keywords,related_name="Posts") 
    link_to_paper = models.URLField(blank=True)
    authors = models.ManyToManyField(User,related_name="Posts")
    image = models.ImageField(null=True,blank=True,upload_to="images/")
    creation_user = models.ForeignKey(User,null=True,on_delete=models.SET_NULL)



    def __str__(self):
        return self.title

class UserBookmarks(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ManyToManyField(Post)




    

