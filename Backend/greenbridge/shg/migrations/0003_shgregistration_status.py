# Generated by Django 4.1.13 on 2024-09-28 17:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shg', '0002_shgprofile_shgregistration_remove_shg_approved_by_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='shgregistration',
            name='status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Pending', max_length=20),
        ),
    ]
