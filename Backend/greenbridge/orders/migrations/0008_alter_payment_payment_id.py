# Generated by Django 5.1.2 on 2024-10-26 03:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0007_payment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='payment_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]