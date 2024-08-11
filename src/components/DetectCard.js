import { BASE_CHAIN_ID } from "../wallet/connect"
import openLink from "../utils/openLink"
import getBuyLink from "../utils/getBuyLink"
import UpButton from "./UpButton"
import Button from "./Button"
import { MemeCard } from "./MemeCard"
import { useAccount, useReadContract } from "wagmi"
import useBalance from "../hooks/useBalance"
import useAsyncRequest from "../hooks/useAsyncRequest"
import { getBalance } from '@wagmi/core'
import { config } from '../wallet/connect'

export default function ({
  number,
  token,
}) {
  const { address: walletAddress } = useAccount()

  function handleBuy() {
    openLink(getBuyLink({ sellTokenAddress: "ETH", buyTokenAddress: token.address, chainId: token.chainId }))
  }

  const balanceLoader = useAsyncRequest(async () => {
    const {
      decimals,
      symbol,
      value,
    } = await getBalance(config, {
      address: walletAddress,
      token: token.address,
      chainId: token.chainId,
    })
    return value
  })

  // const stakeLoader = useReadContract({

  // })

  function getRightButton() {

    // if (balance > 0n) {
    //   return (
    //   )
    // }

    return (
      <button onClick={handleBuy}>
        BUY
      </button>
    )
  }

  return (
    <MemeCard
      number={number}
      key={token.id}
      title={token.symbol}
      image={token.image}
      totalPoints={token.points}
      rightButton={getRightButton()}
    />
  )
}
