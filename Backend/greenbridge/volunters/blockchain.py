import hashlib
import json
from time import time
from typing import List, Dict

class Block:
    def __init__(self, index: int, timestamp: float, data: Dict, previous_hash: str):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self) -> str:
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "previous_hash": self.previous_hash
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()

class VolunteerBlockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]

    def create_genesis_block(self) -> Block:
        return Block(0, time(), {"message": "Genesis Block for Volunteer Records"}, "0")

    def get_latest_block(self) -> Block:
        return self.chain[-1]

    def add_block(self, data: Dict) -> Block:
        previous_block = self.get_latest_block()
        new_block = Block(
            index=previous_block.index + 1,
            timestamp=time(),
            data=data,
            previous_hash=previous_block.hash
        )
        self.chain.append(new_block)
        return new_block

    def is_chain_valid(self) -> bool:
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i-1]

            if current_block.hash != current_block.calculate_hash():
                return False

            if current_block.previous_hash != previous_block.hash:
                return False

        return True

    def get_volunteer_history(self, volunteer_id: int) -> List[Dict]:
        history = []
        for block in self.chain[1:]:  # Skip genesis block
            if block.data.get('volunteer_id') == volunteer_id:
                history.append({
                    'timestamp': block.timestamp,
                    'action': block.data.get('action'),
                    'details': block.data.get('details'),
                    'hash': block.hash
                })
        return history 