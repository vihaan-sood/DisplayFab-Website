# Generated by Django 5.0.6 on 2024-09-11 23:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='is_moderated',
            field=models.BooleanField(default=False),
        ),
    ]
