from django.contrib import admin
from . models import *

# Register your models here.

admin.site.register(Post)
admin.site.register(Keywords)
admin.site.register(MarkdownText)
admin.site.register(UserBookmark)