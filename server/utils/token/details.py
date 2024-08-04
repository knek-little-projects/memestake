from web3 import Web3
from collections import namedtuple

# Sample ERC-20 ABI
ERC20_ABI = [
    {
        "constant": True,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    }
]


TokenDetails = namedtuple("TokenDetails", "name symbol decimals")


def get_erc20_web3_details(web3, addr):

    addr = Web3.to_checksum_address(addr)

    if not web3.is_connected():
        raise Exception("Error: Unable to connect to web3 provider")

    # Create a contract instance
    contract = web3.eth.contract(address=addr, abi=ERC20_ABI)

    # Fetch token details
    name = contract.functions.name().call()
    symbol = contract.functions.symbol().call()
    decimals = contract.functions.decimals().call()
    
    return TokenDetails(
        name=name,
        symbol=symbol,
        decimals=decimals,
    )


def get_token_details(chain, addr):
    # examples:
    # degen base https://basescan.org/token/0x4ed4e862860bed51a9570b96d89af5e1b0efefed
    # pepe mainnet https://etherscan.io/token/0x6982508145454ce325ddbe47a25d4ec3d2311933

    if chain == "base":
        web3 = Web3(Web3.HTTPProvider("https://mainnet.base.org"))
    else:
        raise Exception(f"Fetching from '{chain}' is not implemented yet")

    return get_erc20_web3_details(web3, addr)

