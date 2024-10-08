# Generated by Django 4.1.13 on 2024-09-29 17:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shg', '0003_shgregistration_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shgregistration',
            name='email',
            field=models.EmailField(db_index=True, max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='shgregistration',
            name='registration_number',
            field=models.CharField(db_index=True, max_length=255, unique=True),
        ),
    ]
