# Generated by Django 5.0.6 on 2024-07-23 18:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userbookmark',
            old_name='posts',
            new_name='post',
        ),
    ]
