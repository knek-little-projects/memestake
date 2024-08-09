import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

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

export default function () {

  const memes = useAsyncRequest(() => api.getTokens({ chainId: BASE_CHAIN_ID }))

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
      <Loader {...memes}>
        <div className="select-page-content">
          <div className="your-memes">
            <h1>
              YOUR MEMES
            </h1>
            <div className="connect-buttons">
              <ConnectButton />
            </div>
          </div>
          <MemeList>
            {
              memes.data && memes.data.map(
                token => (
                  <MemeCard
                    showUp={true}
                    number={parseInt(Math.random() * 1000)}
                    key={token.id}
                    title={token.name}
                    image={token.image}
                    volume={1}
                    onUpClick={handleUpClick}
                  />
                )
              )
            }
          </MemeList>
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
          <MemeList>
            {
              memes.data && memes.data.map(
                token => (
                  <MemeCard
                    showBuy={true}
                    number={100}
                    key={token.id}
                    title={token.name}
                    image={token.image}
                    volume={1}
                    onClick={() => handleBuy(token)}
                    onUpClick={handleUpClick}
                  />
                )
              )
            }
          </MemeList>
          <div className="top-ten">
            <h1>
              &#9733;
              TOP 100
              &#9733;
            </h1>
            <h2>
            </h2>
          </div>
        </div>
        <MemeList>
          {
            memes.data && memes.data.map(
              token => (
                <MemeCard
                  showBuy={true}
                  number={100}
                  key={token.id}
                  title={token.name}
                  image={token.image}
                  volume={1}
                  onClick={() => handleBuy(token)}
                />
              )
            )
          }
        </MemeList>
      </Loader>

    </div>
  )
}