from typing import Dict
from datetime import datetime, timedelta
import random
from decimal import Decimal
from .smart_contracts import DonationSmartContract, ContractStatus, DonationType

class AutoContractGenerator:
    def __init__(self):
        self.purpose_templates = [
            "Education Support",
            "Healthcare Initiative",
            "Food Distribution",
            "Emergency Relief",
            "Community Development"
        ]
        
        self.milestone_templates = [
            {
                "phase": "Initial",
                "completion_percentage": 25,
                "verification": "document_verification"
            },
            {
                "phase": "Intermediate",
                "completion_percentage": 50,
                "verification": "progress_report"
            },
            {
                "phase": "Advanced",
                "completion_percentage": 75,
                "verification": "field_verification"
            },
            {
                "phase": "Final",
                "completion_percentage": 100,
                "verification": "impact_assessment"
            }
        ]

    def generate_contract(self, donor_id: int, ngo_id: int) -> Dict:
        """Generate a new smart contract automatically"""
        amount = Decimal(str(random.randint(1000, 10000)))
        purpose = random.choice(self.purpose_templates)
        donation_type = random.choice(list(DonationType))
        
        # Generate milestone dates
        start_date = datetime.now()
        milestone_dates = [
            start_date + timedelta(days=30 * (i + 1))
            for i in range(len(self.milestone_templates))
        ]

        # Create milestones
        milestones = []
        remaining_amount = amount
        for i, template in enumerate(self.milestone_templates):
            milestone_amount = (amount * Decimal(str(template["completion_percentage"]/100))) - sum(m.get('amount', 0) for m in milestones)
            if i == len(self.milestone_templates) - 1:
                milestone_amount = remaining_amount
            else:
                remaining_amount -= milestone_amount

            milestones.append({
                'description': f"{template['phase']} Phase - {purpose}",
                'target_date': milestone_dates[i].strftime('%Y-%m-%d'),
                'amount': milestone_amount,
                'verification_method': template['verification'],
                'status': 'pending'
            })

        contract_data = {
            'donor_id': donor_id,
            'ngo_id': ngo_id,
            'terms': {
                'amount': str(amount),
                'type': donation_type.value,
                'purpose': purpose,
                'distribution_schedule': 'milestone-based'
            },
            'milestones': milestones,
            'status': ContractStatus.PENDING.value,
            'created_at': datetime.now().isoformat()
        }

        return contract_data 