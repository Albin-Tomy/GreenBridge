# Generated by Django 5.1.2 on 2024-10-25 19:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_payment_is_successful_payment_payment_method'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Payment',
        ),
    ]