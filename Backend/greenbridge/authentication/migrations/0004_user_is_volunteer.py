# Generated by Django 5.1.2 on 2025-02-27 07:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_user_is_ngo'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_volunteer',
            field=models.BooleanField(default=False),
        ),
    ]
