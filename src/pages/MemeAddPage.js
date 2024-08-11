import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAccount } from "wagmi"
import { useWeb3Modal } from "@web3modal/wagmi/react"

import Button from "../components/Button"
import Input from "../components/Input"
import useAsyncRequest from "../hooks/useAsyncRequest"

import * as api from "../api"
import Loader from "../components/Loader"
import EthAddressInput from "../components/EthAddressInput"
import isValidAddress from "../utils/isValidAddress"
import { ConnectButton } from "../components/ConnectButton"
import useBalance from "../hooks/useBalance"
import { BASE_CHAIN_ID, BASE_MEMESTAKE_TOKEN_ADDRESS } from "../wallet/connect"
import shortifyNumber from "../utils/shortifyNumber"
import shortifyBalance from "../utils/shortifyBalance"

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
  const { address: walletAddress } = useAccount()
  const [isPublished, setPublished] = useState(details.listed)

  const balanceLoader = useBalance({
    walletAddress,
    tokenAddress: BASE_MEMESTAKE_TOKEN_ADDRESS,
    chainId: BASE_CHAIN_ID,
  })
  const { balance, decimals } = balanceLoader

  const fee = 10n ** 18n;  // TODO: fetch from contract

  async function handlePublish() {
    await api.publish(details)
    setPublished(true)
  }

  return (
    <div>
      <TokenDetails {...details} />
      <Loader {...balanceLoader}>
        {
          balanceLoader.isLoaded
          &&
          <>
            <div>You have {shortifyBalance(balance, 18)} $MEMESTAKE</div>
            {
              balance < fee
              &&
              <div>
                <div>
                  You need to buy extra {shortifyBalance(fee - balance, 18)} $MEMESTAKEs to publish {details.symbol}
                </div>
                <div>
                  <Button>
                    BUY
                  </Button>
                </div>
              </div>
              ||
              (
                isPublished
                &&
                <div>
                  Published!
                </div>
                ||
                <div>
                  <Button>
                    1. Approve $MEMESTAKEs
                  </Button>
                  <Button>
                    2. Pay {shortifyBalance(fee, 18)} $MEMESTAKEs
                  </Button>
                  <Button onClick={handlePublish}>
                    3. PUBLISH {details.symbol}
                  </Button>
                </div>
              )
            }
          </>
        }
      </Loader>
    </div>
  )
}


export function MemeCheckForm() {
  const navigate = useNavigate()
  const { addr: checkTokenAddress } = useParams()

  const [text, setText] = useState(checkTokenAddress)

  useEffect(() => {
    if (checkTokenAddress && text && checkTokenAddress !== text) {
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
      return await api.getTokenDetails(BASE_CHAIN_ID, checkTokenAddress)
    } catch (e) {
      console.error(e)
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

export default function () {

  const { isConnected } = useAccount()

  return (
    <div>
      <ConnectButton />
      {
        isConnected
        &&
        <MemeCheckForm />
      }
    </div>
  )
}