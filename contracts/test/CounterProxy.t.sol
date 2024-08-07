// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Counter.sol";
import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

contract CounterTest is Test {
    Counter public counter;
    TransparentUpgradeableProxy public proxy;
    ProxyAdmin public proxyAdmin;
    Counter public proxyCounter;

    function setUp() public {
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

        // Initialize the Counter contract at the proxy address
        proxyCounter = Counter(address(proxy));
    }

    function testProxyDeployment() public {
        // Verify that the proxy is initialized correctly
        uint256 initialCount = proxyCounter.count();
        assertEq(initialCount, 0);

        // Increment the counter through the proxy
        proxyCounter.increment();
        uint256 incrementedCount = proxyCounter.count();
        assertEq(incrementedCount, 1);
    }
}
