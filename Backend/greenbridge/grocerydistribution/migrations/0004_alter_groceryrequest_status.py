# Generated by Django 5.1.2 on 2025-03-10 08:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grocerydistribution', '0003_grocerydistributionplan_grocerydistributionfeedback'),
    ]

    operations = [
        migrations.AlterField(
            model_name='groceryrequest',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected'), ('collected', 'Collected'), ('cancelled', 'Cancelled'), ('distribution_planned', 'Distribution Planned'), ('distributed', 'Distributed')], default='pending', max_length=20),
        ),
    ]
