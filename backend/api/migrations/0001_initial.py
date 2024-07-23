# Generated by Django 5.0.6 on 2024-07-23 18:02

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Keywords',
            fields=[
                ('key_id', models.AutoField(primary_key=True, serialize=False)),
                ('word', models.CharField(max_length=15)),
                ('IsRegistered', models.BooleanField(null=True)),
                ('occurances', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='MarkdownText',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('content', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=100)),
                ('subheading', models.CharField(max_length=250, null=True)),
                ('link_to_paper', models.URLField(blank=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='images/')),
                ('authors', models.ManyToManyField(related_name='Posts', to=settings.AUTH_USER_MODEL)),
                ('content', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.markdowntext')),
                ('creation_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('keywords', models.ManyToManyField(related_name='Posts', to='api.keywords')),
            ],
        ),
        migrations.CreateModel(
            name='UserBookmark',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('posts', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.post')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
