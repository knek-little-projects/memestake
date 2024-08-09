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

import "./MemeListPage.scss"

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

  return (
    <div>
      <Loader {...memes}>
        <div className="select-page-content">
          <h1 className="select-page-title">
            YOUR MEMES
          </h1>
          <div style={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}>
            <ConnectButton />
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
          <h1 className="select-page-title">
            TOP MEMES
          </h1>
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
                    onUpClick={handleUpClick}
                  />
                )
              )
            }
          </MemeList>
        </div>
      </Loader>

    </div>
  )
}