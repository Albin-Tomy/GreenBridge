import requests
import json
from typing import Dict, List, Optional

class NonProfitBlockchainClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.headers = {"X-API-Key": api_key}
    
    def add_record(self, organization_id: str, record_type: str, data: Dict) -> Dict:
        """
        Add a new record to the blockchain
        
        Args:
            organization_id: Unique identifier for the organization
            record_type: Type of record (donation, volunteer, etc.)
            data: The record data to store
            
        Returns:
            The created block
        """
        url = f"{self.base_url}/api/v1/blocks"
        payload = {
            "organization_id": organization_id,
            "record_type": record_type,
            "data": data
        }
        response = requests.post(url, json=payload, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def get_records(self, organization_id: Optional[str] = None, record_type: Optional[str] = None) -> List[Dict]:
        """
        Get records from the blockchain
        
        Args:
            organization_id: Filter by organization ID
            record_type: Filter by record type
            
        Returns:
            List of blocks matching the criteria
        """
        url = f"{self.base_url}/api/v1/blocks"
        params = {}
        if organization_id:
            params["organization_id"] = organization_id
        if record_type:
            params["record_type"] = record_type
            
        response = requests.get(url, params=params, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def verify_chain(self) -> bool:
        """
        Verify the integrity of the blockchain
        
        Returns:
            True if the chain is valid, False otherwise
        """
        url = f"{self.base_url}/api/v1/verify"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()["is_valid"] 