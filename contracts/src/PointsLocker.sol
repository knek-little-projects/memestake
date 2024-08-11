// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

struct Vault {
    uint totalPoints;
    uint totalReward;
    mapping (address user => uint amount) userPoints;
}

contract PointsLocker is Ownable {
    IERC20 public immutable rewardToken;
    IERC20 public immutable pointsToken;

    uint public currentEpoch;

    event Locked(address indexed user, IERC20 indexed token, uint indexed epoch, uint amount);
    event Burned(address indexed user, IERC20 indexed token, uint indexed epoch, uint amount);

    mapping(IERC20 token => mapping(uint epoch => Vault)) public vaults;

    constructor(IERC20 _rewardToken, IERC20 _pointsToken) Ownable(msg.sender) {
        rewardToken = _rewardToken;
        pointsToken = _pointsToken;
    }

    function setEpoch(uint epoch) external onlyOwner {
        currentEpoch = epoch;
    }

    function setAirdrop(IERC20 token, uint epoch, uint reward) external onlyOwner {
        require(currentEpoch != epoch, "E");
        vaults[token][epoch].totalReward = reward;
    }

    function claimAirdrop(IERC20 token, uint epoch) external {
        Vault storage vault = vaults[token][epoch];

        uint userPoints = vault.userPoints[msg.sender];
        uint userReward = (vault.totalReward * userPoints) / vault.totalPoints;

        vault.totalPoints -= userPoints;
        vault.totalReward -= userReward;
        delete vault.userPoints[msg.sender];

        ERC20Burnable(address(pointsToken)).burn(userPoints);
        emit Burned(msg.sender, token, epoch, userPoints);

        SafeERC20.safeTransfer(rewardToken, msg.sender, userReward);
    }

    function lockFor(address user, IERC20 token, uint amount) external {
        SafeERC20.safeTransferFrom(pointsToken, msg.sender, address(this), amount);
        Vault storage vault = vaults[token][currentEpoch];

        vault.userPoints[user] += amount;
        vault.totalPoints += amount;

        emit Locked(user, token, currentEpoch, amount);
    }
}
