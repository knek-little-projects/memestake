import { useAccount } from "wagmi";
import useBalance from "./useBalance"

export default function (tokens) {
  const { address: walletAddress } = useAccount()

  const balances = {}

  for (const t of tokens) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      balances[t.id] = useBalance({ walletAddress, tokenAddress: t.address, chainId: t.chainId, })
  }

  return balances
}