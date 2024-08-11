import { nonnull } from "../data/strict"

export default function getBuyLink({ sellTokenAddress, buyTokenAddress, chainId }) {
    nonnull(sellTokenAddress, "sellTokenAddress")
    nonnull(buyTokenAddress, "buyTokenAddress")
    nonnull(chainId, "chainId")

    return `https://app.1inch.io/#/${chainId}/simple/swap/${sellTokenAddress}/${buyTokenAddress}`
}