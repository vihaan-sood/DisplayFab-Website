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
        ('Personal Info', {'fields': ('image', 'about_me', 'first_name', 'last_name', 'user_keywords')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'password1', 'password2', 'is_staff', 'is_active', 'image', 'about_me', 'user_keywords'),
        }),
    )
    search_fields = ('email', 'username')
    ordering = ('email',)

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'subheading', 'link_to_paper', 'date_created', 'creation_user', 'my_work', 'report_count')
    list_filter = ('date_created', 'keywords', 'authors')
    search_fields = ('title', 'subheading', 'keywords__word', 'authors__username')
    readonly_fields = ('date_created',)
    
    fieldsets = (
        (None, {
            'fields': ('title', 'subheading', 'content', 'keywords', 'link_to_paper', 'authors', 'image', 'creation_user', 'my_work', 'report_count')
        }),
        ('Important dates', {
            'fields': ('date_created',)
        }),
    )

admin.site.register(CustomUser, UserAdmin)
admin.site.register(Post,PostAdmin)
admin.site.register(Keywords)
admin.site.register(MarkdownText)
admin.site.register(UserBookmark)
admin.site.register(Report)