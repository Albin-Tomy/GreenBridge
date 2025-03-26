from typing import Dict, List
from datetime import datetime, timedelta
from .contract_manager import DonationContractManager
from .models import Donation

class AutomaticContractCreator:
    def __init__(self):
        self.contract_manager = DonationContractManager()

    def create_contract_from_donation(self, donation: Donation) -> str:
        """Automatically create a smart contract from a donation"""
        
        # Generate contract terms based on donation type
        terms = self._generate_terms(donation)
        
        # Create contract
        contract_id = self.contract_manager.create_contract(
            donor_id=donation.user.id,
            ngo_id=donation.ngo.id
        )
        
        # Set terms
        self.contract_manager.set_contract_terms(contract_id, terms)
        
        # Generate milestones
        milestones = self._generate_milestones(donation)
        contract = self.contract_manager.contracts[contract_id]
        contract.set_milestones(milestones)
        
        # Activate contract if donation is already completed
        if donation.status == 'completed':
            self.contract_manager.activate_contract(contract_id)
            self.contract_manager.process_donation(contract_id, float(donation.amount))
        
        return contract_id

    def _generate_terms(self, donation: Donation) -> Dict:
        """Generate contract terms based on donation type"""
        terms = {
            'amount': float(donation.amount),
            'type': donation.donation_type,
            'purpose': donation.purpose,
            'distribution_schedule': 'immediate'
        }
        
        if donation.donation_type == 'monthly':
            terms['distribution_schedule'] = 'monthly'
            terms['duration'] = 12  # 12 months
        
        return terms

    def _generate_milestones(self, donation: Donation) -> List[Dict]:
        """Generate appropriate milestones based on donation type"""
        milestones = []
        now = datetime.now()
        
        if donation.donation_type == 'one-time':
            milestones = [
                {
                    'description': 'Fund Transfer to NGO',
                    'target_date': (now + timedelta(days=1)).strftime('%Y-%m-%d'),
                    'amount': float(donation.amount) * 0.5,
                    'verification_method': 'transfer_confirmation'
                },
                {
                    'description': 'Impact Report Submission',
                    'target_date': (now + timedelta(days=30)).strftime('%Y-%m-%d'),
                    'amount': float(donation.amount) * 0.5,
                    'verification_method': 'document_verification'
                }
            ]
        elif donation.donation_type == 'monthly':
            amount_per_month = float(donation.amount) / 12
            for i in range(12):
                milestones.append({
                    'description': f'Month {i+1} Distribution',
                    'target_date': (now + timedelta(days=30 * (i+1))).strftime('%Y-%m-%d'),
                    'amount': amount_per_month,
                    'verification_method': 'transfer_confirmation'
                })
        elif donation.donation_type == 'project':
            milestones = [
                {
                    'description': 'Project Initiation',
                    'target_date': (now + timedelta(days=1)).strftime('%Y-%m-%d'),
                    'amount': float(donation.amount) * 0.3,
                    'verification_method': 'transfer_confirmation'
                },
                {
                    'description': 'Mid-project Review',
                    'target_date': (now + timedelta(days=45)).strftime('%Y-%m-%d'),
                    'amount': float(donation.amount) * 0.4,
                    'verification_method': 'progress_report'
                },
                {
                    'description': 'Project Completion',
                    'target_date': (now + timedelta(days=90)).strftime('%Y-%m-%d'),
                    'amount': float(donation.amount) * 0.3,
                    'verification_method': 'completion_report'
                }
            ]
        
        return milestones 