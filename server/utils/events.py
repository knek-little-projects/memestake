from web3 import Web3
import time


def fetch_events_in_chunks(event, start_block, end_block, chunk_size):
    events = []

    for start in range(start_block, end_block, chunk_size):
        end = min(start + chunk_size - 1, end_block)
        print(f"Fetching events from block {start} to {end}")
        retries = 3
        while retries > 0:
            try:
                event_filter = event.create_filter(fromBlock=start, toBlock=end)
                events.extend(event_filter.get_all_entries())
                break
            except ValueError as e:
                print(f"Error: {e}")
                retries -= 1
                time.sleep(5)  # wait for 5 seconds before retrying
        else:
            print(f"Failed to fetch events from block {start} to {end} after retries.")

    return events


def fetch_base_events(
    contract_address,
    contract_abi,
    event_name,
    start_block,
    current_block=None,
    chunk_size=10000,  # Define a reasonable chunk size
):

    # Connect to your Ethereum node
    web3 = Web3(Web3.HTTPProvider("https://mainnet.base.org"))

    # Check if connection is successful
    if not web3.is_connected():
        raise Exception("Error: Unable to connect to web3 provider")

    contract_address = Web3.to_checksum_address(contract_address)

    # Create a contract instance
    contract = web3.eth.contract(address=contract_address, abi=contract_abi)

    # Define the event
    event = getattr(contract.events, event_name)()

    if current_block is None:
        current_block = web3.eth.block_number

    return fetch_events_in_chunks(event, start_block, current_block, chunk_size)

