import { useReadContract } from "wagmi"

const erc20ABI = [
  // Only include the ABI necessary for the read
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
]


export default function useBalance({ tokenAddress, walletAddress, chainId }) {
  const balance = useReadContract({
    enabled: !!tokenAddress,
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [walletAddress],
    chainId,
    // watch: true,
  })

  const decimals = useReadContract({
    enabled: !!tokenAddress,
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'decimals',
    args: [],
    chainId,
  });

  const isError = balance?.isError || decimals?.isError
  const isLoading = !isError && (balance?.isLoading || decimals?.isLoading)
  const isLoaded = !!(!isLoading && !isError && (balance?.data !== undefined) && (decimals?.data !== undefined))

  const loading = !isError && (isLoading || !isLoaded)
  const bnBalance = balance?.data
  const bnDecimals = decimals?.data

  return {
    loading,
    error: isError,
    isLoaded,
    isLoading,
    isError,
    balance: bnBalance,
    decimals: bnDecimals,
  }
}