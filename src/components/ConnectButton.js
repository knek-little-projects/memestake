import { useState, useEffect, useRef } from "react"
import { useWalletInfo, useWeb3Modal, useWeb3ModalEvents } from "@web3modal/wagmi/react"
import { useAccount } from "wagmi"
import useViewportSize from "../hooks/useViewportSize"
import url from "../url"
import Button from "./Button"
import "./ConnectButton.scss"

function hideKeyboard() {
  var field = document.createElement('input');
  field.setAttribute('type', 'text');
  field.setAttribute('style', 'height: 1px');
  document.body.appendChild(field);

  setTimeout(function () {
    field.focus();
    setTimeout(function () {
      field.setAttribute('style', 'display:none;');
    }, 50);
  }, 50);
}

export function forceDisconnect() {
  window.localStorage.removeItem("@w3m/connected_connector")
  window.localStorage.removeItem("@w3m/connected_wallet_image_url")
  window.localStorage.removeItem("wagmi.recentConnectorId")
  window.localStorage.removeItem("wagmi.store")
  window.location.reload()
}

export function ConnectButton() {
  const { open, close } = useWeb3Modal()
  const { address, isConnected, isConnecting, isReconnecting, isDisconnected } = useAccount()
  const { walletInfo } = useWalletInfo()
  const { height } = useViewportSize()
  const viewportHeightRef = useRef(height)

  if (height > viewportHeightRef.current) {
    viewportHeightRef.current = height
  }

  function handleClick() {
    open()
  }

  const event = useWeb3ModalEvents()
  const [lastEventTimestamp, setLastEventTimestamp] = useState(event?.timestamp || 0)

  useEffect(() => {
    // stupid hacks for telegram
    if (event) {
      if (event.timestamp > lastEventTimestamp) {
        setLastEventTimestamp(event.timestamp)
        console.debug("wallet event", event)
        const eventType = event.data?.event
        if (eventType === "CONNECT_SUCCESS" || eventType === "MODAL_CLOSE") {
          console.debug("wallet info", walletInfo)
          if (height < viewportHeightRef.current) {
            console.debug("hide keyboard dirty")
            hideKeyboard()
          } else {
            console.debug("do not hide keyboard")
          }
        } else if (eventType === "DISCONNECT_ERROR") {
          forceDisconnect()
        }
      }
    }
  }, [event])

  return (
    <div className="connect-button">

      <Button onClick={handleClick}>
        <div className="button-content">
          {
            isConnected
            &&
            <>
              {
                walletInfo?.icon
                &&
                <img src={walletInfo.icon} />
                ||
                <img src={url("eth.png")} />
              }
              {
                address
                &&
                <div>
                  {
                    address.slice(0, 5) + "..." + address.slice(-5)
                  }
                </div>
              }
            </>
            ||
            <>
              <img src={url("eth.png")} />
              Connect Wallet
            </>
          }
        </div>
      </Button>
    </div>
  )
}
