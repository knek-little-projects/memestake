import { useEffect, useState } from "react"

import Button from "../components/Button"
import Input from "../components/Input"
import useAsyncRequest from "../hooks/useAsyncRequest"

import * as api from "../api"
import Loader from "../components/Loader"
import EthAddressInput from "../components/EthAddressInput"
import isValidAddress from "../utils/isValidAddress"
import { useNavigate, useParams } from "react-router-dom"


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

function StakeAndPublishForm({
  ...details
}) {
  const [stakeAndPublish, setStakeAndPublish] = useState(false)
  return (
    <div>
      <TokenDetails {...details} />
      {
        stakeAndPublish
        &&
        <>
          You have ?? $memestakes
        </>
        ||
        <Button onClick={() => setStakeAndPublish(true)}>
          Stake and publish
        </Button>
      }
    </div>
  )
}


export default function () {
  const navigate = useNavigate()
  const { addr: checkTokenAddress } = useParams()

  const [text, setText] = useState("")

  useEffect(() => {
    if (checkTokenAddress !== text) {
      setText(checkTokenAddress)
    }
  }, [checkTokenAddress])

  function setCheckTokenAddress(addr) {
    navigate(`/add/${addr}`)
  }

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
                    <StakeAndPublishForm {...details} />
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