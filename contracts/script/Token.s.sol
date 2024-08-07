// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Token} from "../src/Token.sol";

contract TokenScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        new Token(
            "MemeStake",
            "MEMESTAKE",
            0x1a44076050125825900e736c501f859c50fE728c,
            vm.envAddress("OWNER"),
            vm.envUint("PREMINT")
        );

        vm.stopBroadcast();
    }
}
