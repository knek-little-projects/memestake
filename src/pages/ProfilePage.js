import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { getBalance } from '@wagmi/core'
import { addresses, config } from '../wallet/connect'
import { ConnectButton } from "../components/ConnectButton"
import useAsyncRequest from "../hooks/useAsyncRequest"
import Loader from "../components/Loader"
import * as api from "../api"
import { BASE_CHAIN_ID } from "../wallet/connect"
import { MemeList, MemeCard } from "../components/MemeCard"
import { floatReward } from '../components/Reward'
import { extractLeftTop } from "../utils/extractLeftTop"
import "./MemeListPage.scss"
import url from "../url"
import UpButton from "../components/UpButton"
import DetectCard from "../components/DetectCard"
import { writeContract, readContract } from '@wagmi/core'

import PointsController from "../abi/PointsController.json"
import MemeStaking from "../abi/MemeStaking.json"
import IERC20 from "../abi/IERC20.json"
import UnstakeCard from "../components/UnstakeCard"

export default function () {
  const { isConnected, address: walletAddress } = useAccount()
  const tokens = useAsyncRequest(() => api.getTokens({ chainId: BASE_CHAIN_ID }))
  const userTokens = useAsyncRequest(async () => {
    const stakedTokens = []
    const unstakedTokensWithBalance = []

    for (let index = 0; index < tokens.data?.length; index++) {
      const token = tokens.data[index]

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

      const staked = result[0]
      if (staked > 0n) {
        stakedTokens.push({ index, token })
        continue
      }

      const {
        decimals,
        symbol,
        value,
      } = await getBalance(config, {
        address: walletAddress,
        token: token.address,
        chainId: token.chainId,
      })

      if (value > 0n) {
        unstakedTokensWithBalance.push({ index, token })
        continue
      }
    }

    return { stakedTokens, unstakedTokensWithBalance }
  }, [tokens.data])

  return (
    <div>
      <Loader {...tokens}>
        <div className="select-page-content">
          <div className="your-memes">
            <h1>
              STAKED MEMES
            </h1>
            <div className="connect-buttons">
              <ConnectButton />
            </div>
          </div>
          {
            isConnected
            &&
            <Loader {...userTokens}>
              <MemeList>
                {
                  userTokens.data?.stakedTokens?.map(
                    ({ token, index }) => (
                      <UnstakeCard
                        number={index + 1}
                        key={token.id}
                        token={token}
                      />
                    )
                  )
                }
                {
                  userTokens.data?.unstakedTokensWithBalance?.map(
                    ({ token, index }) => (
                      <UnstakeCard
                        number={index + 1}
                        key={token.id}
                        token={token}
                      />
                    )
                  )
                }
              </MemeList>
            </Loader>

          }
        </div>
      </Loader >

    </div >
  )
}