// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import "../src/MemeStaking.sol";
import "./MockToken.sol";

contract CounterTest is Test {
    MemeStaking public staking;
    MockToken public token;

    function setUp() public {
        staking = new MemeStaking();
        token = new MockToken();
    }

    function test() public {
        uint start = token.balanceOf(address(this));

        token.approve(address(staking), 1e18);
        staking.stake(token, 1e18);

        require(token.balanceOf(address(this)) == start - 1e18);

        staking.unstake(token, 1e18);

        require(token.balanceOf(address(this)) == start);
    }
}
