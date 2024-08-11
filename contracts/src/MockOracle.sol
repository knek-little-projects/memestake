// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

interface IOracle {
    function getPrice(IERC20 token) external view returns (uint);
}

contract MockOracle is Ownable {
    mapping (IERC20 token => uint) public getPrice;

    constructor(
    ) Ownable(msg.sender) {
    }

    function setPrice(IERC20 token, uint price) external onlyOwner {
        getPrice[token] = price;
    }
}
