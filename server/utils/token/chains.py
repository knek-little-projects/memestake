from collections import namedtuple

BASE_CHAIN_ID = 8453

Chain = namedtuple("Chain", "id name")

CHAINS = {
    BASE_CHAIN_ID: Chain(id=BASE_CHAIN_ID, name="base")
}

def get_chain_by_id(id):
    return CHAINS[BASE_CHAIN_ID]


