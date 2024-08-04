import { useState } from "react"

import Button from "../components/Button"
import Input from "../components/Input"
import useAsyncRequest from "../hooks/useAsyncRequest"

import * as api from "../api"
import Loader from "../components/Loader"
import EthAddressInput from "../components/EthAddressInput"
import isValidAddress from "../utils/isValidAddress"


function TokenDetails({
  chain,
  address,
  name,
  symbol,
  decimals,
  image,
}) {
  return (
    <div>
      <div>Chain: {chain}</div>
      <div>Address: {address}</div>
      <div>Name: {name}</div>
      <div>Symbol: {symbol}</div>
      <div>Decimals: {decimals}</div>
      <div>
        <img src={image} style={{ maxWidth: "256px", maxHeight: "256px" }} />
      </div>
    </div>
  )
}


export default function () {
  const [text, setText] = useState("")
  const [checkTokenAddress, setCheckTokenAddress] = useState()

  const tokenLoader = useAsyncRequest(async () => {
    if (!checkTokenAddress) {
      return undefined
    }

    if (!isValidAddress(checkTokenAddress)) {
      return undefined
    }

    try {
      const details = await api.getTokenDetails("base", checkTokenAddress)
      details.address = checkTokenAddress
      details.chain = "base"
      return details
    } catch {
      return null
    }

  }, [checkTokenAddress])

  const details = tokenLoader.data

  return (
    <div>
      Token address on BASE chain:
      <EthAddressInput value={text} onChange={text => setText(text)} />
      {
        isValidAddress(text)
        &&
        <div>
          {
            text !== checkTokenAddress
            &&
            <Button onClick={() => setCheckTokenAddress(text)}>Check</Button>
          }
          {
            text === checkTokenAddress
            &&
            <Loader {...tokenLoader}>
              {
                (details === undefined || details && details.address !== checkTokenAddress)
                &&
                <>
                </>
                ||
                (
                  details === null
                  &&
                  <div>
                    Couldn't fetch token... Is it on BASE chain?
                  </div>
                  ||
                  <div>
                    <TokenDetails {...details} />
                    <Button>
                      STAKE AND PUBLISH
                    </Button>
                  </div>
                )
              }
            </Loader>
          }
        </div>
      }
    </div>
  )
}