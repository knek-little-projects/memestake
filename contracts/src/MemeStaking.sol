// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct Stake {
    uint amount;
    uint timestamp;
}

contract MemeStaking {
    mapping(address user => mapping(IERC20 token => Stake)) public stakes;

    event Staked(address indexed user, IERC20 indexed token, uint amount);
    event Unstaked(address indexed user, IERC20 indexed token, uint amount);

    function stake(IERC20 token, uint amount) external {
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), amount);

        Stake storage s = stakes[msg.sender][token];
        s.amount += amount;
        s.timestamp = block.timestamp;

        emit Staked(msg.sender, token, amount);
    }

    function unstake(IERC20 token, uint amount) external {
        Stake storage s = stakes[msg.sender][token];

        s.amount -= amount;
        s.timestamp = block.timestamp;

        SafeERC20.safeTransfer(token, msg.sender, amount);
        emit Unstaked(msg.sender, token, amount);
    }
}
