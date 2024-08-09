import { nonnull } from "../data/strict"

export default function getBuyLink({ sellTokenAddress, buyTokenAddress, chainId }) {
    nonnull(sellTokenAddress)
    nonnull(buyTokenAddress)
    nonnull(chainId)

    return `https://app.1inch.io/#/${chainId}/simple/swap/${sellTokenAddress}/${buyTokenAddress}`
}