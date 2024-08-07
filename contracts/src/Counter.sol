// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Counter is Initializable {
    uint256 public number;

    function initialize() initializer public {
    }

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }

    function count() public view returns (uint) {
        return number;
    }
}
