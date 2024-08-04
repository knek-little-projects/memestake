
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { mainnet, bsc } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const chains = [
  mainnet,
  bsc,
]

export function getChainById(id) {
  return [...chains].find(x => x.id === id)
}

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Your WalletConnect Cloud project ID
const projectId = '8efd479542ffb3dc2dd1ec7b182b0ee1'

// 2. Create wagmiConfig
const metadata = {
  name: 'Meme Stake',
  description: 'Meme Stake',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  // ...wagmiOptions // Optional - Override createConfig parameters
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
})

export function Web3ModalProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}