import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { getBalance } from '@wagmi/core'
import { config } from '../wallet/connect'
import { ConnectButton } from "../components/ConnectButton"
import useAsyncRequest from "../hooks/useAsyncRequest"
import Loader from "../components/Loader"
import * as api from "../api"
import { BASE_CHAIN_ID } from "../wallet/connect"
import { MemeList, MemeCard } from "../components/MemeCard"
import { floatReward } from '../components/Reward'
import { extractLeftTop } from "../utils/extractLeftTop"
import openLink from "../utils/openLink"
import getBuyLink from "../utils/getBuyLink"
import "./MemeListPage.scss"
import url from "../url"
import UpButton from "../components/UpButton"

export default function () {
  const { isConnected, address: walletAddress } = useAccount()
  const tokens = useAsyncRequest(() => api.getTokens({ chainId: BASE_CHAIN_ID }))
  const userTokens = useAsyncRequest(async () => {
    const stakedTokens = []
    const unstakedTokensWithBalance = []
    if (tokens.data) {
      for (const t of tokens.data) {
        // if token.staking.balanceOf(user)
        // stakedTokens.push(t)

        const {
          decimals,
          symbol,
          value,
        } = await getBalance(config, {
          address: walletAddress,
          token: t.address,
          chainId: t.chainId,
        })

        if (value > 0n) {
          unstakedTokensWithBalance.push(t)
        }
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

  function handleBuy(token) {
    openLink(getBuyLink({ sellTokenAddress: "ETH", buyTokenAddress: token.address, chainId: BASE_CHAIN_ID }))
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
                    token => (
                      <MemeCard
                        number={parseInt(Math.random() * 1000)}
                        key={token.id}
                        title={token.symbol}
                        image={token.image}
                        volume={1}
                        rightButton={
                          <UpButton onClick={handleUpClick} />
                        }
                      />
                    )
                  )
                }
                {
                  userTokens.data?.unstakedTokensWithBalance?.map(
                    token => (
                      <MemeCard
                        number={parseInt(Math.random() * 1000)}
                        key={token.id}
                        title={token.symbol}
                        image={token.image}
                        volume={1}
                        rightButton={
                          <button>
                            STAKE
                          </button>
                        }
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
                token => (
                  <MemeCard
                    number={100}
                    key={token.id}
                    title={token.symbol}
                    image={token.image}
                    volume={1}
                    onClick={() => handleBuy(token)}
                    rightButton={
                      <button>BUY</button>
                    }
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
              token => (
                <MemeCard
                  number={100}
                  key={token.id}
                  title={token.symbol}
                  image={token.image}
                  volume={1}
                  onClick={() => handleBuy(token)}
                  rightButton={
                    <button>BUY</button>
                  }
                />
              )
            )
          }
        </MemeList>
      </Loader >

    </div >
  )
}