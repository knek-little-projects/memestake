// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Token is OFT {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate,
        uint premint
    ) 
    Ownable(
        _delegate
    )
    OFT(
        _name,
        _symbol,
        _lzEndpoint,
        _delegate
    ){
        _mint(_delegate, premint);
    }
}