from django.db import models

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


#Creating custom user model
class Keywords(models.Model): 
    key_id = models.AutoField(primary_key=True)
    word = models.CharField(max_length=15)
    IsRegistered = models.BooleanField(null= True)
    occurances = models.IntegerField(default=0) #typo in spelling, too late to change

    def __str__(self):
        return self.word
    

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=False)
    last_name = models.CharField(max_length=30, blank=False)

    image = models.ImageField(upload_to='user_images/', null=True, blank=True)
    about_me = models.TextField(blank=True, null=True)

    user_keywords = models.ManyToManyField(Keywords,blank=True)


    
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email','first_name','last_name']

    def __str__(self):
        return self.username




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
    authors = models.ManyToManyField(CustomUser,related_name="Posts")
    image = models.ImageField(null=True,blank=True,upload_to="images/")
    creation_user = models.ForeignKey(CustomUser,null=True,on_delete=models.SET_NULL)
    date_created = models.DateTimeField(auto_now_add=True)
    my_work = models.BooleanField(default=False)
    report_count = models.IntegerField(default=0)



    def __str__(self):
        return self.title
    
class UserBookmark(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    post = models.ForeignKey(Post,on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'post')

class Report(models.Model):
    user = models.ForeignKey(CustomUser , on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

class LinkedPost(models.Model):
    post1 = models.ForeignKey(Post,on_delete=models.CASCADE,related_name='linked_posts_as_post1')
    post2 = models.ForeignKey(Post,on_delete=models.CASCADE, related_name='linked_posts_as_post2')

    class Meta:
        unique_together = ('post1', 'post2')








    

