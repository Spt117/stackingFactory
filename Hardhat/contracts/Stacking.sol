// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Staking : a staking contract to your ERC20 token !
 * @author JB
 */

contract Staking {
    //Information about the token

    address public immutable token;
    uint256 immutable dateStart;
    uint256 immutable dateStop;
    majStackingPool[] public stakingTimes;

    struct Staker {
        uint128 amount; // Amount token stake
        uint128 date; // Date of stake start
    }
    // address Staker => Informations Staker
    mapping(address => Staker) stakers;

    // Save total amount with timestamp
    struct majStackingPool {
        uint256 blockDate;
        uint128 stakingTotalPool;
    }

    event Stake(address sender, uint128 amount, uint256 date);
    event Unstake(address sender, uint128 amount, uint256 date);

    constructor(address _token, uint256 _dateStop) {
        token = _token;
        dateStart = block.timestamp;
        dateStop = _dateStop;
    }

    /**
     * @notice Stake fund into this contract
     * @param _amount to stake
     * @dev Emit event after stake
     */
    function stake(uint128 _amount) external {
        require(_amount > 0, "Amount can't be zero");
        uint256 rewards;
        if (stakers[msg.sender].amount == 0) {
            rewards = 0;
        } else {
            rewards = calculateReward();
        }

        bool result = IERC20(token).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        require(result, "Transfer from error");

        _upAmountStaker(_amount);
        _upStackingPool(_amount);

        if (rewards > 0) {
            _getRewards(rewards);
        } // Récupérer les rewards en même temps

        emit Stake(msg.sender, _amount, block.timestamp);
    }

    /**
     * @notice Withdraw fund into this contract
     * @param _amount number of token to unstake
     */
    function withdraw(uint128 _amount) external {
        require(
            _amount <= stakers[msg.sender].amount,
            "Don't have so many tokens"
        );
        uint256 rewards = calculateReward();
        bool result = IERC20(token).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        require(result, "Transfer from error");

        _downStackingPool(_amount);
        _downAmountStaker(_amount);

        _getRewards(rewards); // Récupérer les rewards en même temps

        emit Unstake(msg.sender, _amount, block.timestamp);
    }

    /**
     * @notice Calculate rewards
     * @dev tokenPrice use Chainlink Oracle
     * @return rewards in token
     */
    function calculateReward() public view returns (uint256) {
        uint256 rewardsPerSeconds = IERC20(token).balanceOf(address(this)) /
            (dateStop - dateStart);
        uint256 rewardspartoOfPool;
        uint256 x = stakingTimes.length;
        uint256 blockIndex;
        for (uint256 i = 0; i < x; i++) {
            if (stakingTimes[i].blockDate == stakers[msg.sender].date) {
                blockIndex = i;
            }
        }

        if (x == 1) {
            rewardspartoOfPool += (block.timestamp - stakers[msg.sender].date);
        } else {
            for (uint256 i = blockIndex; i < x - 1; i++) {
                rewardspartoOfPool +=
                    ((stakingTimes[i + 1].blockDate -
                        stakingTimes[i].blockDate) *
                        stakers[msg.sender].amount) /
                    stakingTimes[i].stakingTotalPool;
            }
            rewardspartoOfPool +=
                ((block.timestamp - stakingTimes[x - 1].blockDate) *
                    stakers[msg.sender].amount) /
                (stakingTimes[stakingTimes.length - 1].stakingTotalPool);
        }

        return rewardspartoOfPool * rewardsPerSeconds;
    }

    /**
     * @notice Claim your rewards
     * @dev Available only for stakers who have rewards to claim
     */
    function claimRewards() external {
        uint256 rewards = calculateReward();
        // upStackingPool();
        stakers[msg.sender].date = uint128(block.timestamp); //Remettre à 0 le timestamp
        _getRewards(rewards);
    }

    /**
     * @notice Autoclaim rewards when add staking or withdraw
     * @dev Available only for function stake and withdraw
     */
    function _getRewards(uint256 _rewards) private {
        bool result = IERC20(token).transfer(msg.sender, _rewards);
        require(result, "Transfer from error");
    }

    /**
     * @notice Check amount of a stacked pool from msg.sender
     */
    function getStaking() external view returns (uint256) {
        return stakers[msg.sender].amount;
    }

    /**
     * @notice Update Staker Struct when he stake
     * @dev called in function stake
     * @param _amount is the amount to stake
     */
    function _upAmountStaker(uint128 _amount) private {
        stakers[msg.sender] = Staker(
            stakers[msg.sender].amount + _amount,
            uint128(block.timestamp)
        );
    }

    /**
     * @notice Update Staker Struct when he withdraw
     * @dev called in function withdraw
     * @param _amount is the amount to stake
     */
    function _downAmountStaker(uint128 _amount) private {
        stakers[msg.sender] = Staker(
            stakers[msg.sender].amount - _amount,
            uint128(block.timestamp)
        );
    }

    /**
     * @notice Update majStackingPool when there is a stake
     * @dev called in function stake
     * @param _amount is the amount to stake
     */
    function _upStackingPool(uint128 _amount) private {
        uint128 lastTotalStake;
        if (stakingTimes.length == 0) {
            lastTotalStake = 0;
        } else {
            lastTotalStake = stakingTimes[stakingTimes.length - 1]
                .stakingTotalPool;
        }
        majStackingPool memory maj = majStackingPool(
            block.timestamp,
            lastTotalStake + _amount
        );
        stakingTimes.push(maj);
    }

    /**
     * @notice Update majStackingPool when there is a withdraw
     * @dev called in function withdrawF
     * @param _amount is the amount to stake
     */
    function _downStackingPool(uint128 _amount) private {
        uint128 lastTotalStake = stakingTimes[stakingTimes.length - 1]
            .stakingTotalPool;
        majStackingPool memory maj = majStackingPool(
            block.timestamp,
            lastTotalStake - _amount
        );
        stakingTimes.push(maj);
    }
}
