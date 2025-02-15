# Generated by Django 5.1.2 on 2024-10-25 14:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_cartitems_quantity'),
    ]

    operations = [
        migrations.AddField(
            model_name='payment',
            name='is_successful',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='payment',
            name='payment_method',
            field=models.CharField(choices=[('online', 'Online'), ('cod', 'Cash on Delivery')], default='online', max_length=10),
        ),
    ]
