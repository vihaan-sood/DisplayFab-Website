# Generated by Django 5.0.6 on 2024-08-07 01:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_customuser_user_keywords_alter_customuser_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='user_keywords',
            field=models.ManyToManyField(blank=True, to='api.keywords'),
        ),
    ]
