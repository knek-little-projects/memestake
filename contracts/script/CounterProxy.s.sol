// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

contract CounterScript is Script {
    Counter public counter;
    TransparentUpgradeableProxy public proxy;
    ProxyAdmin public proxyAdmin;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // Deploy the logic contract (Counter)
        counter = new Counter();

        // Deploy the ProxyAdmin
        proxyAdmin = new ProxyAdmin(address(this));

        // Encode the initialization call
        bytes memory data = abi.encodeWithSelector(Counter.initialize.selector);

        // Deploy the TransparentUpgradeableProxy
        proxy = new TransparentUpgradeableProxy(
            address(counter),
            address(proxyAdmin),
            data
        );

        vm.stopBroadcast();
    }
}
