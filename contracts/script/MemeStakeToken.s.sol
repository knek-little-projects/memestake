// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import "../src/MemeStakeToken.sol";

contract MemeStakeTokenScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        new MemeStakeToken(
            "MemeStake",
            "MEMESTAKE",
            0x1a44076050125825900e736c501f859c50fE728c,
            vm.envAddress("OWNER"),
            vm.envUint("PREMINT")
        );

        vm.stopBroadcast();
    }
}
