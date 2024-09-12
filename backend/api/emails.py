from django.core.mail import send_mail
import random
from django.conf import settings
from .models import CustomUser, Post

def send_email_code(email):
    try:
        subject = 'Email Confirmation | Active Materials Library'
        code = random.randint(100000, 999999)
        user_obj = CustomUser.objects.get(email = email)
        username = user_obj.username
        message = f'Hi {username} \n\nYour verification code is {code} \nWe\'re glad to have you here at the Active Materials Library! \n\n-The AML Team'
        email_from = settings.EMAIL_HOST_USER
        send_mail (subject, message, email_from, [email])
        
        user_obj.verification_code = code
        user_obj.save()

    except CustomUser.DoesNotExist:
        print(f"User with email {email} does not exist.")
    except Exception as e:
        print(f"Failed to send verification code: {e}")

def new_post_email(postid):
    try:
        
        post_obj = Post.objects.get(id = postid)
        username = post_obj.creation_user.username
        email = settings.EMAIL_HOST_USER
        subject = 'New Post! | Moderation Requested'
        message = f'{username} just posted! \n\nPost ID: {postid} \n\nTitle: {post_obj.title} \n\nCreated at: {post_obj.date_created}'
        email_from = settings.EMAIL_HOST_USER
        send_mail (subject, message, email_from, [email])
        


    except CustomUser.DoesNotExist:
        print(f"User with email {email} does not exist.")
    except Exception as e:
        print(f"Failed to send email: {e}")