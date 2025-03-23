from volunters.blockchain import VolunteerBlockchain
from .models import Donation

class DonationBlockchainService:
    def __init__(self):
        self.blockchain = VolunteerBlockchain()
    
    def record_donation(self, donation: Donation):
        """
        Record a donation in the blockchain
        
        Args:
            donation: The Donation model instance to record
        """
        donation_data = {
            'record_type': 'donation',
            'donation_id': donation.id,
            'user_id': donation.user.id,
            'amount': float(donation.amount),
            'donation_type': donation.donation_type,
            'purpose': donation.purpose,
            'payment_id': donation.razorpay_payment_id,
            'timestamp': donation.created_at.timestamp(),
            'action': 'donation_made'
        }
        
        # Add the donation to the blockchain
        block = self.blockchain.add_donation_block(donation_data)
        return block
    
    def get_user_donations(self, user_id):
        """Get all donations for a specific user from the blockchain"""
        return self.blockchain.get_donation_history(user_id)
    
    def get_all_donations(self):
        """Get all donations recorded in the blockchain"""
        return self.blockchain.get_donation_history() 