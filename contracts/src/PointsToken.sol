// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract PointsToken is OFT {
    mapping(address => bool) public canMint;

    modifier onlyMinter {
        require(canMint[msg.sender], "M");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate
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
    }

    function setMinter(address minter, bool _canMint) external onlyOwner {
        canMint[minter] = _canMint;
    }

    function mint(address target, uint amount) external onlyMinter {
        _mint(target, amount);
    }

    function burn(uint amount) external {
        _burn(msg.sender, amount);
    }
}