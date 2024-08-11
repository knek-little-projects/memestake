// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

import "./PointsToken.sol";
import "./MemeStakeToken.sol";
import "./PointsLocker.sol";
import "./MemeStaking.sol";
import "./MockOracle.sol";

contract PointsController is Ownable {
    MemeStakeToken immutable public rewardToken;
    PointsToken immutable public pointsToken;
    PointsLocker immutable public pointsLocker;
    MemeStaking immutable public memeStaking;

    IOracle public oracle;

    uint public cooldownPeriod = 60;
    uint public multiplier = 10;
    uint public registerFee = 0.01e18;

    mapping (address user => mapping (IERC20 token => uint)) public lastClaimTime;
    
    event RegisterMeme(IERC20 indexed meme, uint fee);
    event PointsLocked(address indexed user, IERC20 indexed token, uint amount);

    constructor(
        MemeStaking _memeStaking,
        PointsLocker _pointsLocker,
        IOracle _oracle
    ) Ownable(msg.sender) {
        oracle = _oracle;
        memeStaking = _memeStaking;
        pointsLocker = _pointsLocker;
        rewardToken = MemeStakeToken(address(_pointsLocker.rewardToken()));
        pointsToken = PointsToken(address(_pointsLocker.pointsToken()));

        pointsToken.approve(address(_pointsLocker), type(uint).max);
    }

    function whenReady(address user, IERC20 token) public view returns (uint) {
        (, uint lastStakeTime) = memeStaking.stakes(user, token);

        if (lastStakeTime == 0) {
            return 0;
        }

        if (lastClaimTime[user][token] < lastStakeTime) {
            return lastStakeTime + cooldownPeriod;
        }

        return lastClaimTime[user][token] + cooldownPeriod;
    }

    function pointsPerPeriod(address user, IERC20 token) public view returns (uint) {
        (uint amount, ) = memeStaking.stakes(user, token);
        return amount * oracle.getPrice(token) / 1e18;
    }

    function setOracle(IOracle _oracle) external onlyOwner {
        oracle = _oracle;
    }

    function setCooldownPeriod(uint _cooldownPeriod) external onlyOwner {
        cooldownPeriod = _cooldownPeriod;
    }

    function setFees(uint _registerFee) external onlyOwner {
        registerFee = _registerFee;
    }

    function setMultiplier(uint _multiplier) external onlyOwner {
        multiplier = _multiplier;
    }

    function lockPoints(IERC20 token) external {
        require(whenReady(msg.sender, token) <= block.timestamp, "T");
        lastClaimTime[msg.sender][token] = block.timestamp;

        uint points = pointsPerPeriod(msg.sender, token);

        pointsToken.mint(address(this), points);
        pointsLocker.lockFor(msg.sender, token, points);

        emit PointsLocked(msg.sender, token, points);
    }

    function registerMeme(IERC20 meme) external {
        SafeERC20.safeTransferFrom(rewardToken, msg.sender, owner(), registerFee);
        emit RegisterMeme(meme, registerFee);
    }
}
