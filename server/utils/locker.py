from web3 import Web3
from .events import fetch_base_events
import os
import time
import json


class Locker:
    def __init__(self, addr):
        self.addr = addr
        self.abi = json.load(open(os.path.join(os.path.dirname(__file__), "abi", "PointsLocker.json")))["abi"]

    def fetch_new_memes(self, start_block):
        return fetch_base_events(self.addr, self.abi, "RegisterMeme", start_block)

    # event Locked(address indexed user, IERC20 indexed token, uint indexed epoch, uint amount);
    # event Burned(address indexed user, IERC20 indexed token, uint indexed epoch, uint amount);

    def fetch_add_points(self, start_block, current_block=None):
        # TODO: use own .get_web3()
        return fetch_base_events(self.addr, self.abi, "Locked", start_block, current_block)

    def get_web3(self):
        # Connect to your Ethereum node
        web3 = Web3(Web3.HTTPProvider("https://mainnet.base.org"))

        # Check if connection is successful
        if not web3.is_connected():
            raise Exception("Error: Unable to connect to web3 provider")

        return web3

    # TODO: watch for Burned too


if __name__ == "__main__":
    print(Locker("0x90339bD2eECcf6eaFC14940B1F993edB3de78573").fetch_add_points(18292964-1,18292964+1 ))        