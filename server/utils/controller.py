from web3 import Web3
from events import fetch_base_events
import os
import time
import json


class Controller:
    def __init__(self, addr):
        self.addr = addr
        self.abi = json.load(open(os.path.join(os.path.dirname(__file__), "abi", "PointsController.json")))["abi"]

    def fetch_new_memes(self, start_block):
        return fetch_base_events(self.addr, self.abi, "RegisterMeme", start_block)


if __name__ == "__main__":
    print(Controller("0xDDC2D0bf8Ab0416e9c019885dd23611c06E12b52").fetch_new_memes(18286799))