import { BASE_CHAIN_ID, addresses } from "../wallet/connect"
import openLink from "../utils/openLink"
import getBuyLink from "../utils/getBuyLink"
import UpButton from "./UpButton"
import Button from "./Button"
import shortifyBalance from "../utils/shortifyBalance"
import { MemeCard } from "./MemeCard"
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { writeContract, readContract } from '@wagmi/core'
import useBalance from "../hooks/useBalance"
import useAsyncRequest from "../hooks/useAsyncRequest"
import { getBalance } from '@wagmi/core'
import { config } from '../wallet/connect'

import PointsController from "../abi/PointsController.json"
import MemeStaking from "../abi/MemeStaking.json"
import IERC20 from "../abi/IERC20.json"

import { useEffect, useState } from "react"

export default function ({
  number,
  token,
}) {
  const { address: walletAddress } = useAccount()
  const [stakeFlow, setStakeFlow] = useState(false)
  const [hash, setHash] = useState(undefined)

  const receipt = null //useWaitForTransactionReceipt({ hash })
  console.debug("redraw")
  const w = useWriteContract(config)

  function handleBuy() {
    openLink(getBuyLink({ sellTokenAddress: "ETH", buyTokenAddress: token.address, chainId: token.chainId }))
  }

  function handleUp() {
    writeContract(config, {
      abi: PointsController.abi,
      address: addresses.pointsController,
      chainId: token.chainId,
      functionName: "lockPoints",
      args: [
        token.address
      ]
    })
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

  const allowanceLoader = useAsyncRequest(async () => {
    return await readContract(config, {
      abi: IERC20.abi,
      address: token.address,
      chainId: token.chainId,
      functionName: "allowance",
      args: [
        walletAddress,
        addresses.memeStaking,
      ]
    })
  })

  const stakeLoader = useAsyncRequest(async () => {
    const result = await readContract(config, {
      abi: MemeStaking.abi,
      address: addresses.memeStaking,
      chainId: token.chainId,
      functionName: "stakes",
      args: [
        walletAddress,
        token.address,
      ]
    })
    return result[0]
  }, [stakeFlow])

  const lockablePointsLoader = useAsyncRequest(async () => {
    return await readContract(config, {
      abi: PointsController.abi,
      address: addresses.pointsController,
      chainId: token.chainId,
      functionName: "pointsPerPeriod",
      args: [
        walletAddress,
        token.address,
      ]
    })
  }, [stakeFlow])

  const whenReadyLoader = useAsyncRequest(async () => {
    return await readContract(config, {
      abi: PointsController.abi,
      address: addresses.pointsController,
      chainId: token.chainId,
      functionName: "whenReady",
      args: [
        walletAddress,
        token.address,
      ]
    })
  }, [ receipt ])

  const balance = balanceLoader.data
  const allowance = allowanceLoader.data
  const staked = stakeLoader.data
  const lockablePoints = lockablePointsLoader.data
  const whenReady = whenReadyLoader.data

  function handleStake() {
    setStakeFlow(true)
  }

  useEffect(() => {
    if (stakeFlow && allowance !== undefined && balance !== undefined) {
      if (allowance < balance) {
        writeContract(config, {
          abi: IERC20.abi,
          address: token.address,
          chainId: token.chainId,
          functionName: "approve",
          args: [
            addresses.memeStaking,
            balance,
          ]
        })
      } else {
        writeContract(config, {
          abi: MemeStaking.abi,
          address: addresses.memeStaking,
          functionName: "stake",
          chainId: token.chainId,
          args: [
            token.address,
            balance,
          ]
        }).then(() => setStakeFlow(false))
      }
    }
  }, [stakeFlow, balanceLoader, allowanceLoader])

  function getRightButton() {

    if (staked > 0n) {

      return (
        <UpButton
          onClick={handleUp}
        >
          {
            lockablePoints !== undefined
            &&
            
            (
              whenReady <= (new Date().getTime() / 1000)
              &&
            <>
              +{shortifyBalance(lockablePoints, 18)}
            </>
            ||
            <>
            cooldown {parseInt(whenReady - new Date().getTime() / 1000)} seconds
            </>
            )


          }
        </UpButton>
      )
    }

    if (balance > 0n) {
      return (
        <button onClick={handleStake}>
          STAKE
        </button>
      )
    }

    return (
      <button onClick={handleBuy}>
        BUY
      </button>
    )
  }


  // function clickme() {
  //   w.writeContractAsync({
  //     abi: IERC20.abi,
  //     address: token.address,
  //     chainId: token.chainId,
  //     functionName: "approve",
  //     args: [
  //       addresses.memeStaking,
  //       0n,
  //     ]
  //   })
  //   .then(hash => setHash(hash))
  // }

  return (
    // <Button onClick={clickme}>Click</Button>
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
