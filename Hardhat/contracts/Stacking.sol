// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Staking : a staking contract to your ERC20 token !
 * @author JB
 */

contract Stacking {
    //Information about the token

    address immutable token;
    address immutable owner;
    uint256 immutable dateStart;
    uint256 immutable dateStop;
    uint256 amountTokenRewards;
    majStackingPool[] public stakingTimes;

    struct Stacker {
        uint128 amount; // Amount token stake
        uint128 date; // Date of stake start
    }
    // address Stacker => Informations Stacker
    mapping(address => Stacker) public stackers;

    // Save total amount with timestamp
    struct majStackingPool {
        uint256 blockDate;
        uint128 stakingTotalPool;
    }

    event PoolSupplied(uint256 reawards);
    event Stake(address sender, uint128 amount, uint256 date);
    event Unstake(address sender, uint128 amount, uint256 date);

    constructor(
        address _token,
        uint256 _dateStart,
        uint256 _dateStop,
        address _owner
    ) {
        token = _token;
        dateStart = _dateStart;
        dateStop = _dateStop;
        owner = _owner;
    }

    /**
     * @notice give the rewards Token to the contract
     * @param _amount is the amount of tokens to reward
     */
    function supplyContract(uint256 _amount) external {
        if (msg.sender != owner) revert("You are not the owner");
        if (amountTokenRewards > 0) revert("Contract has already a supply");
        amountTokenRewards = _amount;
        _transferFrom(msg.sender, address(this), amountTokenRewards);
        emit PoolSupplied(amountTokenRewards);
    }

    /**
     * @notice Stake fund into this contract
     * @param _amount to stake
     * @dev Emit event after stake
     */
    function stake(uint128 _amount) external {
        if (amountTokenRewards == 0) revert("Contract hasn't supply");
        uint256 rewards;
        if (stackers[msg.sender].amount == 0) {
            rewards = 0;
        } else {
            rewards = calculateReward(msg.sender);
        }

        _transferFrom(msg.sender, address(this), _amount);

        _upAmountStacker(_amount);
        _upStackingPool(_amount);

        if (rewards > 0) {
            _transfer(rewards, msg.sender);
        } // Récupérer les rewards en même temps

        emit Stake(msg.sender, _amount, block.timestamp);
    }

    /**
     * @notice Withdraw fund into this contract
     * @param _amount number of token to unstake
     */
    function withdraw(uint128 _amount) external {
        if (_amount > stackers[msg.sender].amount) revert("Don't have so many tokens");
        uint256 rewards = calculateReward(msg.sender);

        _transfer(_amount, msg.sender);

        _downStackingPool(_amount);
        _downAmountStacker(_amount);

        _transfer(rewards, msg.sender); // Récupérer les rewards en même temps

        emit Unstake(msg.sender, _amount, block.timestamp);
    }

    /**
     * @notice Calculate rewards
     * @dev tokenPrice use Chainlink Oracle
     * @param _sender is the msg.sender
     * @return rewards in token
     */
    function calculateReward(address _sender) public view returns (uint256) {
        if (stackers[_sender].amount == 0) {
            return 0;
        } else {
            uint256 rewardsPerSeconds = amountTokenRewards / (dateStop - dateStart);
            uint256 rewardspartoOfPool;
            uint256 length = stakingTimes.length;
            uint256 blockIndex;
            for (uint256 i = 0; i < length; i++) {
                if (stakingTimes[i].blockDate == stackers[msg.sender].date) {
                    blockIndex = i;
                }
            }

            if (length == 1) {
                rewardspartoOfPool += (block.timestamp - stackers[msg.sender].date);
            } else {
                for (uint256 i = blockIndex; i < length - 1; i++) {
                    rewardspartoOfPool += ((stakingTimes[i + 1].blockDate - stakingTimes[i].blockDate) * stackers[msg.sender].amount) / stakingTimes[i].stakingTotalPool;
                }
                rewardspartoOfPool += ((block.timestamp - stakingTimes[length - 1].blockDate) * stackers[msg.sender].amount) / (stakingTimes[stakingTimes.length - 1].stakingTotalPool);
            }

            return rewardspartoOfPool * rewardsPerSeconds;
        }
    }

    /**
     * @notice Claim your rewards
     * @dev Available only for stackers who have rewards to claim
     */
    function claimRewards() external {
        uint256 rewards = calculateReward(msg.sender);
        _upStackingPool(0);
        stackers[msg.sender].date = uint128(block.timestamp); //Remettre à 0 le timestamp
        _transfer(rewards, msg.sender);
    }

    /**
     * @notice Autoclaim rewards when add staking or withdraw
     * @dev Available only for function stake and withdraw
     */
    function _transfer(uint256 _amount, address _to) private {
        bool result = IERC20(token).transfer(_to, _amount);
        require(result, "Transfer from error");
    }

    /**
     * @notice Update Stacker Struct when he stake
     * @dev called in function stake
     * @param _amount is the amount to stake
     */
    function _upAmountStacker(uint128 _amount) private {
        stackers[msg.sender] = Stacker(stackers[msg.sender].amount + _amount, uint128(block.timestamp));
    }

    /**
     * @notice Update Stacker Struct when he withdraw
     * @dev called in function withdraw
     * @param _amount is the amount to stake
     */
    function _downAmountStacker(uint128 _amount) private {
        stackers[msg.sender] = Stacker(stackers[msg.sender].amount - _amount, uint128(block.timestamp));
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
            lastTotalStake = stakingTimes[stakingTimes.length - 1].stakingTotalPool;
        }
        majStackingPool memory maj = majStackingPool(block.timestamp, lastTotalStake + _amount);
        stakingTimes.push(maj);
    }

    /**
     * @notice Update majStackingPool when there is a withdraw
     * @dev called in function withdrawF
     * @param _amount is the amount to stake
     */
    function _downStackingPool(uint128 _amount) private {
        uint128 lastTotalStake = stakingTimes[stakingTimes.length - 1].stakingTotalPool;
        majStackingPool memory maj = majStackingPool(block.timestamp, lastTotalStake - _amount);
        stakingTimes.push(maj);
    }

    /**
     * @notice transfer is the function using transferFrom of ERC20
     * @param _from is address who have the tokens
     * @param _to is the receive address
     * @param _amount is the amount of tokens
     */
    function _transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) private {
        bool result = IERC20(token).transferFrom(_from, _to, _amount);
        require(result, "Transfer from error");
    }

    /**
     * @notice transfer is the function using transferFrom of ERC20
     * @param _token is address of the tokens to stake
     * @param _owner is owner of the pool
     * @param _dateStart is the date of the start of the stacking
     * @param _dateStop is the date of the end of the stacking
     * @param _amountTokenRewards is the amount of rewards
     */
    function getMyPool()
        public
        view
        returns (
            address _token,
            address _owner,
            uint256 _dateStart,
            uint256 _dateStop,
            uint256 _amountTokenRewards
        )
    {
        return (token, owner, dateStart, dateStop, amountTokenRewards);
    }
}
