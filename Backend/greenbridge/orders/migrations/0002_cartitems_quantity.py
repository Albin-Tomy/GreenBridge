# Generated by Django 5.1.2 on 2024-10-17 17:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='cartitems',
            name='quantity',
            field=models.PositiveIntegerField(default=1),
        ),
    ]
