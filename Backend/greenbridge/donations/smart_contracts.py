from typing import Dict, Any
from decimal import Decimal
from datetime import datetime

class DonationSmartContract:
    def __init__(self):
        self.conditions = {}
        self.triggers = {}
        self.state = {}

    def set_distribution_rules(self, rules: Dict[str, float]):
        """
        Set rules for automatic distribution of donations
        Example: {'education': 0.3, 'food': 0.4, 'emergency': 0.3}
        """
        total = sum(rules.values())
        if not (0.99 <= total <= 1.01):  # Allow for small floating-point differences
            raise ValueError("Distribution percentages must sum to 1.0")
        self.conditions['distribution'] = rules

    def set_matching_rules(self, rules: Dict[str, Any]):
        """
        Set rules for donation matching
        Example: {'threshold': 1000, 'matching_ratio': 1.5}
        """
        self.conditions['matching'] = rules

    def set_milestone_triggers(self, milestones: Dict[int, Dict]):
        """
        Set milestone-based triggers
        Example: {10000: {'action': 'notify_board', 'message': 'Milestone reached'}}
        """
        self.triggers['milestones'] = milestones

    def execute_donation(self, donation_data: Dict) -> Dict:
        """
        Execute smart contract logic for a donation
        """
        result = {
            'original_donation': donation_data,
            'distributions': [],
            'actions': [],
            'timestamp': datetime.now().isoformat()
        }

        amount = Decimal(str(donation_data['amount']))
        
        # Apply distribution rules
        if 'distribution' in self.conditions:
            distributions = self._calculate_distributions(amount)
            result['distributions'] = distributions

        # Apply matching rules
        if 'matching' in self.conditions:
            matching = self._apply_matching_rules(amount)
            if matching:
                result['matching_amount'] = matching
                result['total_amount'] = amount + matching

        # Check milestones
        if 'milestones' in self.triggers:
            milestone_actions = self._check_milestones(amount)
            if milestone_actions:
                result['actions'].extend(milestone_actions)

        # Update contract state
        self._update_state(result)

        return result

    def _calculate_distributions(self, amount: Decimal) -> list:
        """Calculate how the donation should be distributed"""
        distributions = []
        for purpose, percentage in self.conditions['distribution'].items():
            distributed_amount = amount * Decimal(str(percentage))
            distributions.append({
                'purpose': purpose,
                'amount': distributed_amount,
                'percentage': percentage
            })
        return distributions

    def _apply_matching_rules(self, amount: Decimal) -> Decimal:
        """Apply matching donation rules"""
        rules = self.conditions['matching']
        if amount >= Decimal(str(rules['threshold'])):
            return amount * (Decimal(str(rules['matching_ratio'])) - 1)
        return Decimal('0')

    def _check_milestones(self, amount: Decimal) -> list:
        """Check if any milestones are triggered"""
        actions = []
        current_total = self.state.get('total_donations', 0) + amount

        for threshold, action in self.triggers['milestones'].items():
            if current_total >= threshold > self.state.get('total_donations', 0):
                actions.append(action)
        
        return actions

    def _update_state(self, transaction_result: Dict):
        """Update the contract state"""
        current_total = self.state.get('total_donations', Decimal('0'))
        self.state['total_donations'] = current_total + Decimal(str(transaction_result['original_donation']['amount']))
        self.state['last_transaction'] = transaction_result
        self.state['transaction_count'] = self.state.get('transaction_count', 0) + 1

    def get_state(self) -> Dict:
        """Get current state of the smart contract"""
        return self.state 