# Generated by Django 5.1.2 on 2025-02-06 09:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('volunters', '0006_update_food_quality_report_field'),
    ]

    operations = [
        migrations.DeleteModel(
            name='FoodQualityReport',
        ),
    ]
