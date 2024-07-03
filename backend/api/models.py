from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Keywords(models.Model): 
    key_id = models.AutoField(primary_key=True)
    word = models.CharField(max_length=15)
    IsRegistered = models.BooleanField()
    occurances = models.IntegerField()





class Post(models.Model):
    title = models.CharField(max_length = 200)
    #caption/subheading
    content = models.TextField() #markdown here
    keywords = models.ManyToManyField(Keywords,related_name="Posts") 
    link_to_paper = models.URLField()
    authors = models.ManyToManyField(User,related_name="Posts")
    #image



    def __str__(self):
        return self.title


#User page