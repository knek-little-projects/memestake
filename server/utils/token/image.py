import requests


def get_token_image(chain, addr):
    def get_token_image_by_address(address):
        address = address.lower()
        url = f"https://api.coingecko.com/api/v3/coins/{chain}/contract/{address}"
        
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if 'image' in data:
                return data['image']['large']
        return None

    def get_trustwallet_token_image(address):
        address = address.lower()
        url = f"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/{chain}/assets/{address}/logo.png"
        
        response = requests.get(url)
        if response.status_code == 200:
            return url
        return None

    def get_uniswap_token_image(address):
        query = """
        {
          token(id: "%s") {
            id
            symbol
            name
            derivedETH
            whitelistPools {
              id
            }
            tokenDayData(first: 1, orderBy: date, orderDirection: desc) {
              priceUSD
            }
          }
        }
        """ % address.lower()

        url = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"
        response = requests.post(url, json={'query': query})
        data = response.json()

        if 'data' in data and 'token' in data['data']:
            token = data['data']['token']
            return f"https://uniswap.org/images/tokens/{token['id']}.png"
        return None

    # Try CoinGecko API
    image_url = get_token_image_by_address(addr)
    if image_url:
        return image_url

    # Try Trust Wallet Assets
    image_url = get_trustwallet_token_image(addr)
    if image_url:
        return image_url

    # Try Uniswap Subgraph
    image_url = get_uniswap_token_image(addr)
    if image_url:
        return image_url

    return None
