// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Locker} from "../src/Locker.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/Token.sol";

contract LockerTest is Test {
    Locker public locker;
    IERC20 public token;

    address alice = address(0x1);
    address bob = address(0x2);

    function setDelegate(address) external {}

    function setUp() public {
        locker = new Locker();
        token = IERC20(address(new Token("Token", "TKN", address(this), address(this))));

        // Mint tokens to alice and bob
        token.transfer(alice, 1000);
        token.transfer(bob, 1000);

        // Approve locker contract to spend tokens
        vm.prank(alice);
        token.approve(address(locker), 1000);

        vm.prank(bob);
        token.approve(address(locker), 1000);
    }

    function test_locker() public {
        // Alice locks token 1 for a few days
        uint t1 = block.timestamp + 3 days;
        vm.prank(alice);
        locker.lock(token, t1, 1000);

        // Bob locks token 2 for a month
        uint t2 = block.timestamp + 60 days;
        vm.prank(bob);
        locker.lock(token, t2, 1000);

        // Try to unlock tokens before time has passed
        vm.expectRevert();
        locker.unlock(token, t1, 1);

        vm.expectRevert();
        vm.prank(alice);
        locker.unlock(token, t1, 1);

        vm.expectRevert();
        vm.prank(alice);
        locker.unlock(token, t1, 1000);

        // Fast forward time by a few days
        vm.warp(t1);

        // Bob cannot unlock Alice's token
        vm.expectRevert();
        vm.prank(bob);
        locker.unlock(token, t1, 1000);

        // Alice can unlock her token
        vm.prank(alice);
        locker.unlock(token, t1, 1000);

        // Fast forward time by a few months
        vm.warp(t2);

        // Alice cannot unlock Bob's token
        vm.expectRevert();
        vm.prank(alice);
        locker.unlock(token, t2, 1000);

        // Bob can unlock his token
        vm.prank(bob);
        locker.unlock(token, t2, 1000);

        // Check final balances
        assertEq(token.balanceOf(alice), 1000);
        assertEq(token.balanceOf(bob), 1000);
    }

    function test_stopped() public {
        // Alice locks token 1 for a few days
        uint t1 = block.timestamp + 3 days;
        vm.prank(alice);
        locker.lock(token, t1, 666);

        // Bob locks token 2 for a month
        uint t2 = block.timestamp + 60 days;
        vm.prank(bob);
        locker.lock(token, t2, 333);

        vm.prank(bob);
        locker.lock(token, t2, 333);

        // unauth stop
        vm.expectRevert();
        vm.prank(bob);
        locker.stop();

        locker.stop();

        // revert lock after stop
        vm.expectRevert();
        vm.prank(bob);
        locker.lock(token, t2, 333);

        // try unauth unlock
        vm.expectRevert();
        locker.unlock(token, t1, 1);

        vm.prank(alice);
        locker.unlock(token, t1, 333);

        // Bob cannot unlock Alice's token
        vm.expectRevert();
        vm.prank(bob);
        locker.unlock(token, t1, 333);

        // alice cannot extract more than staked
        vm.expectRevert();
        vm.prank(alice);
        locker.unlock(token, t1, 666);

        vm.prank(alice);
        locker.unlock(token, t1, 333);

        // Fast forward time by a few months
        vm.warp(t2 * 2);

        // Alice cannot unlock Bob's token
        vm.expectRevert();
        vm.prank(alice);
        locker.unlock(token, t2, 666);

        // Bob can unlock his token
        vm.prank(bob);
        locker.unlock(token, t2, 666);

        // Check final balances
        assertEq(token.balanceOf(alice), 1000);
        assertEq(token.balanceOf(bob),   1000);
    }
}
