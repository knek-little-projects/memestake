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

  function handleUpClick(e) {
    const rect = e.target.getBoundingClientRect()
    let { left, top } = extractLeftTop(e)

    let scrollOffset = 0
    if (document.scrollingElement) {
      scrollOffset = document.scrollingElement.scrollTop
    }

    left += (Math.random() - 1) * rect.width
    top += (Math.random() - 1) * rect.height + scrollOffset

    floatReward({
      left,
      top,
      timeout: 1000,
      container: document.querySelector("body"),
      value: "+1",
      className: "reward"
    })
  }

  return (
    <div>
      <Loader {...tokens}>
        <div className="select-page-content">
          <div className="your-memes">
            <h1>
              YOUR MEMES
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
                      <DetectCard
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
                      <DetectCard
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
          {
            tokens.data?.length > 0
            &&
            <div className="top-ten">
              <h1>
                <img src={url("ui/leaderboard.png")} style={{ padding: '10px' }} />
                TOP TEN
                <img src={url("ui/leaderboard.png")} style={{ padding: '10px' }} />
              </h1>
              <h2>
                TO RECEIVE AIRDROP
              </h2>
            </div>
          }
          <MemeList>
            {
              tokens.data?.slice(0, 10).map(
                (token, index) => (
                  <DetectCard
                    number={index + 1}
                    key={token.id}
                    token={token}
                  />
                )
              )
            }
          </MemeList>
          {
            tokens.data?.length > 10
            &&
            <div className="top-ten">
              <h1>
                &#9733;
                TOP 100
                &#9733;
              </h1>
              <h2>
              </h2>
            </div>
          }
        </div>
        <MemeList>
          {
            tokens.data?.slice(10).map(
              (token, index) => (
                <DetectCard
                  number={index + 1}
                  key={token.id}
                  token={token}
                />
              )
            )
          }
        </MemeList>
      </Loader >

    </div >
  )
}