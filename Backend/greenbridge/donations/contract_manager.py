from typing import Dict, List, Optional
from .smart_contracts import DonationSmartContract
from .blockchain import VolunteerBlockchain
import uuid

class DonationContractManager:
    def __init__(self):
        self.contracts: Dict[str, DonationSmartContract] = {}
        self.blockchain = VolunteerBlockchain()

    def create_contract(self, donor_id: int, ngo_id: int) -> str:
        """Create a new donation smart contract"""
        contract_id = str(uuid.uuid4())
        contract = DonationSmartContract(contract_id, donor_id, ngo_id)
        self.contracts[contract_id] = contract
        return contract_id

    def set_contract_terms(self, contract_id: str, terms: Dict) -> bool:
        """Set terms for a specific contract"""
        if contract_id not in self.contracts:
            raise ValueError("Contract not found")
        
        contract = self.contracts[contract_id]
        success = contract.set_terms(terms)
        
        if success:
            # Record in blockchain
            self.blockchain.add_donation_block({
                'action': 'contract_terms_set',
                'contract_id': contract_id,
                'terms': terms
            })
        
        return success

    def activate_contract(self, contract_id: str) -> bool:
        """Activate a specific contract"""
        if contract_id not in self.contracts:
            raise ValueError("Contract not found")
        
        contract = self.contracts[contract_id]
        success = contract.activate_contract()
        
        if success:
            # Record in blockchain
            self.blockchain.add_donation_block({
                'action': 'contract_activated',
                'contract_id': contract_id
            })
        
        return success

    def process_donation(self, contract_id: str, amount: float) -> bool:
        """Process a donation for a specific contract"""
        if contract_id not in self.contracts:
            raise ValueError("Contract not found")
        
        contract = self.contracts[contract_id]
        success = contract.process_donation(amount)
        
        if success:
            # Record in blockchain
            self.blockchain.add_donation_block({
                'action': 'donation_processed',
                'contract_id': contract_id,
                'amount': amount
            })
        
        return success

    def update_milestone(self, contract_id: str, milestone_index: int, 
                        status: str, proof: Dict) -> bool:
        """Update milestone status for a specific contract"""
        if contract_id not in self.contracts:
            raise ValueError("Contract not found")
        
        contract = self.contracts[contract_id]
        success = contract.update_milestone(milestone_index, status, proof)
        
        if success:
            # Record in blockchain
            self.blockchain.add_donation_block({
                'action': 'milestone_updated',
                'contract_id': contract_id,
                'milestone_index': milestone_index,
                'status': status
            })
        
        return success

    def get_contract_state(self, contract_id: str) -> Optional[Dict]:
        """Get the current state of a specific contract"""
        if contract_id not in self.contracts:
            return None
        return self.contracts[contract_id].get_contract_state()

    def get_all_contracts(self) -> List[Dict]:
        """Get states of all contracts"""
        return [
            contract.get_contract_state() 
            for contract in self.contracts.values()
        ]

    def get_ngo_contracts(self, ngo_id: int) -> List[Dict]:
        """Get all contracts for a specific NGO"""
        return [
            contract.get_contract_state()
            for contract in self.contracts.values()
            if any(party.id == ngo_id and party.role == 'ngo' 
                  for party in contract.parties)
        ]

    def get_donor_contracts(self, donor_id: int) -> List[Dict]:
        """Get all contracts for a specific donor"""
        return [
            contract.get_contract_state()
            for contract in self.contracts.values()
            if any(party.id == donor_id and party.role == 'donor' 
                  for party in contract.parties)
        ] 