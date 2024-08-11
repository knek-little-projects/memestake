// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import "../src/PointsToken.sol";

contract PointsTokenScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        new PointsToken(
            "Memestake Points",
            "PTS",
            0x1a44076050125825900e736c501f859c50fE728c,
            vm.envAddress("OWNER")
        );

        vm.stopBroadcast();
    }
}
