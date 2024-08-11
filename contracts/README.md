# MEMESTAKE

## Deployments

| Chain | Contract | Address |
|-|-|-|
| Base | $MEMESTAKE Token | 0x892d8E4E3e9481455ad355A6BbF5e812A6f0C7e1 |
| Base | $PTS Token | 0xe1ed5B46C3f953A214F75B30DC3cAEe19c6A1694 |
| Base | MemeStaking | 0x4f61479d7b5c65Cb9aa7E8699e5F8A3BCF151f6d |
| Base | PointsLocker | 0x90339bD2eECcf6eaFC14940B1F993edB3de78573 |
| Base | MockOracle | 0xFD21d9bE0a0d278ad3e62f983b267bc2Ed02AC64 |
| Base | PointsController | 0xDDC2D0bf8Ab0416e9c019885dd23611c06E12b52 |

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
