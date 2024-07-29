from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import *

#Register your models here

class UserAdmin(BaseUserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_active')
    readonly_fields = ('date_joined', 'last_login') 
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('image', 'about_me')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_staff', 'is_active', 'image', 'about_me'),
        }),
    )
    search_fields = ('email', 'username')
    ordering = ('email',)

admin.site.register(CustomUser, UserAdmin)
admin.site.register(Post)
admin.site.register(Keywords)
admin.site.register(MarkdownText)
admin.site.register(UserBookmark)