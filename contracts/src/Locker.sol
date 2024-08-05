// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Locker {
    event Locked(address user, IERC20 token, uint expires, uint amount);
    event Unlocked(address user, IERC20 token, uint expires, uint amount);

    mapping(address user => mapping(IERC20 token => mapping(uint expires => uint amount))) locks;

    function lock(IERC20 token, uint expires, uint amount) external {
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), amount);
        locks[msg.sender][token][expires] += amount;
        emit Locked(msg.sender, token, expires, amount);
    }

    function unlock(IERC20 token, uint expires, uint amount) external {
        require(block.timestamp >= expires, "T");
        locks[msg.sender][token][expires] -= amount;
        SafeERC20.safeTransfer(token, msg.sender, amount);
        emit Unlocked(msg.sender, token, expires, amount);
    }
}