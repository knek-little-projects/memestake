// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Locker is Ownable {
    event Locked(address indexed user, IERC20 indexed token, uint expires, uint amount);
    event Unlocked(address indexed user, IERC20 indexed token, uint expires, uint amount);
    event Stopped();

    bool public stopped;
    mapping(address user => mapping(IERC20 token => mapping(uint expires => uint amount))) public locks;

    constructor() Ownable(msg.sender) {
    }

    function stop() external onlyOwner {
        stopped = true;        
        emit Stopped();
    }

    function lock(IERC20 token, uint expires, uint amount) external {
        require(!stopped, "S");
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), amount);
        locks[msg.sender][token][expires] += amount;
        emit Locked(msg.sender, token, expires, amount);
    }

    function unlock(IERC20 token, uint expires, uint amount) external {
        require(stopped || block.timestamp >= expires, "T");
        locks[msg.sender][token][expires] -= amount;
        SafeERC20.safeTransfer(token, msg.sender, amount);
        emit Unlocked(msg.sender, token, expires, amount);
    }
}