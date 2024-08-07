// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Locker} from "../src/Locker.sol";

contract LockerScript is Script {
    Locker public locker;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        new Locker();

        vm.stopBroadcast();
    }
}
