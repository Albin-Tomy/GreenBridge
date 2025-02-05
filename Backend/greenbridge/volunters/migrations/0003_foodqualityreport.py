# Generated by Django 5.1.2 on 2025-02-05 18:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('food_distributions', '0001_initial'),
        ('volunters', '0002_blockchainblock'),
    ]

    operations = [
        migrations.CreateModel(
            name='FoodQualityReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('issue_type', models.CharField(choices=[('expired', 'Food Expired'), ('contaminated', 'Food Contaminated'), ('spoiled', 'Food Spoiled'), ('packaging_damaged', 'Packaging Damaged'), ('temperature_issue', 'Temperature Control Issue'), ('other', 'Other Issue')], max_length=20)),
                ('description', models.TextField()),
                ('images', models.JSONField(blank=True, null=True)),
                ('temperature', models.FloatField(blank=True, null=True)),
                ('reported_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('pending', 'Pending Review'), ('approved', 'Report Approved'), ('rejected', 'Report Rejected')], default='pending', max_length=10)),
                ('admin_notes', models.TextField(blank=True, null=True)),
                ('resolved_at', models.DateTimeField(blank=True, null=True)),
                ('distribution_request', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='food_distributions.fooddistributionrequest')),
                ('volunteer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='volunters.volunteerregistration')),
            ],
        ),
    ]
