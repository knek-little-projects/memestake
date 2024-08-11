import { strict, nonnull, defined } from "./strict"

export const TokenModel = strict(class {
  constructor({
    id,
    chainId,
    address,
    name,
    symbol,
    decimals,
    image,
    listed,
    points,
  }) {
    this.id = nonnull(id)
    this.chainId = nonnull(chainId)
    this.address = nonnull(address)
    this.name = nonnull(name)
    this.symbol = nonnull(symbol)
    this.decimals = nonnull(decimals)
    this.image = nonnull(image)
    this.listed = nonnull(listed)
    this.points = nonnull(points)
  }

  static check(data) {
    new TokenModel(data)
  }

  serialize() {
    return {
        id: this.id,
        chainId: this.chainId,
        address: this.address,
        name: this.name,
        symbol: this.symbol,
        decimals: this.decimals,
        image: this.image,
        listed: this.listed,
        points: this.points,
    }
  }
})