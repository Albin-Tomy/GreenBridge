# Generated by Django 5.1.2 on 2025-01-27 16:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_alter_user_profile_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_ngo',
            field=models.BooleanField(default=False),
        ),
    ]
