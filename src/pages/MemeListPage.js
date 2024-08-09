import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

import { ConnectButton } from "../components/ConnectButton"
import useAsyncRequest from "../hooks/useAsyncRequest"
import Loader from "../components/Loader"
import * as api from "../api"
import { BASE_CHAIN_ID } from "../wallet/connect"

import "./MemeListPage.scss"
import MemeCard from "../components/MemeCard"

export default function () {

  const memes = useAsyncRequest(() => api.getTokens({ chainId: BASE_CHAIN_ID }))

  function handleUpClick() {
    
  }

  return (
    <div>
      <Loader {...memes}>
        <div className="select-page-content">
          <h1 className="select-page-title">
            TOP MEMES
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
          <div className="meme-cards">
            {
              memes.data && memes.data.map(
                token => (
                  <MemeCard
                    title={token.name}
                    image={token.image}
                    onUpClick={handleUpClick}
                  />
                )
              )
            }
          </div>
        </div>
      </Loader>

    </div>
  )
}