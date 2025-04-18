# Generated by Django 5.1.2 on 2025-03-19 16:45

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('volunters', '0002_blockchainblock'),
    ]

    operations = [
        migrations.CreateModel(
            name='VolunteerActivity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('volunteer_id', models.IntegerField()),
                ('request_id', models.IntegerField()),
                ('request_type', models.CharField(max_length=50)),
                ('action', models.CharField(max_length=50)),
                ('status', models.CharField(max_length=50)),
                ('description', models.TextField(blank=True, null=True)),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
            ],
            options={
                'ordering': ['-timestamp'],
            },
        ),
    ]
