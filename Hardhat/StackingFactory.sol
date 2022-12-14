// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

contract StackingFactory {
    Stacking[] public Contracts;

    event newPool(Stacking contrat, address owner);

    function createPool(
        uint256 _dateStart,
        uint256 _dateStop,
        address _token
    ) public {
        Stacking stacke = new Stacking(_token, _dateStart, _dateStop, msg.sender);
        Contracts.push(stacke);
        emit newPool(stacke, msg.sender);
    }

    function getLength() public view returns (uint256) {
        return Contracts.length;
    }
}

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

// File @openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol@v4.8.0

// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/IERC20Metadata.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface for the optional metadata functions from the ERC20 standard.
 *
 * _Available since v4.1._
 */
interface IERC20Metadata is IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}

// File @openzeppelin/contracts/utils/Context.sol@v4.8.0

// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

// File @openzeppelin/contracts/token/ERC20/ERC20.sol@v4.8.0

// OpenZeppelin Contracts (last updated v4.8.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

/**
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 * For a generic mechanism see {ERC20PresetMinterPauser}.
 *
 * TIP: For a detailed writeup see our guide
 * https://forum.openzeppelin.com/t/how-to-implement-erc20-supply-mechanisms/226[How
 * to implement supply mechanisms].
 *
 * We have followed general OpenZeppelin Contracts guidelines: functions revert
 * instead returning `false` on failure. This behavior is nonetheless
 * conventional and does not conflict with the expectations of ERC20
 * applications.
 *
 * Additionally, an {Approval} event is emitted on calls to {transferFrom}.
 * This allows applications to reconstruct the allowance for all accounts just
 * by listening to said events. Other implementations of the EIP may not emit
 * these events, as it isn't required by the specification.
 *
 * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}
 * functions have been added to mitigate the well-known issues around setting
 * allowances. See {IERC20-approve}.
 */
contract ERC20 is Context, IERC20, IERC20Metadata {
    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * The default value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * NOTE: Does not update the allowance if the current allowance
     * is the maximum `uint256`.
     *
     * Requirements:
     *
     * - `from` and `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     * - the caller must have allowance for ``from``'s tokens of at least
     * `amount`.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    /**
     * @dev Moves `amount` of tokens from `from` to `to`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(from, to, amount);

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
            // decrementing then incrementing.
            _balances[to] += amount;
        }

        emit Transfer(from, to, amount);

        _afterTokenTransfer(from, to, amount);
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        unchecked {
            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
            _balances[account] += amount;
        }
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, reducing the
     * total supply.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
            // Overflow not possible: amount <= accountBalance <= totalSupply.
            _totalSupply -= amount;
        }

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
     *
     * Does not update the allowance amount in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Might emit an {Approval} event.
     */
    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    /**
     * @dev Hook that is called before any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * will be transferred to `to`.
     * - when `from` is zero, `amount` tokens will be minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}

    /**
     * @dev Hook that is called after any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * has been transferred to `to`.
     * - when `from` is zero, `amount` tokens have been minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}
}

// File contracts/Stacking.sol

pragma solidity 0.8.16;

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
        uint128 blockDate;
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
        } // R├®cup├®rer les rewards en m├¬me temps

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

        _transfer(rewards, msg.sender); // R├®cup├®rer les rewards en m├¬me temps

        emit Unstake(msg.sender, _amount, block.timestamp);
    }

    /**
     * @notice Calculate rewards
     * @dev tokenPrice use Chainlink Oracle
     * @param _sender is the msg.sender
     * @return rewards in token
     */
    function calculateReward(address _sender) public view returns (uint256) {
        if (stackers[_sender].amount == 0 || block.timestamp < dateStart) {
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
        stackers[msg.sender].date = uint128(block.timestamp); //Remettre ├á 0 le timestamp
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
        uint128 times;
        if (stakingTimes.length == 0) lastTotalStake = 0;
        else lastTotalStake = stakingTimes[stakingTimes.length - 1].stakingTotalPool;

        if (block.timestamp < dateStart) times = uint128(dateStart);
        else times = uint128(block.timestamp);

        majStackingPool memory maj = majStackingPool(times, lastTotalStake + _amount);
        stakingTimes.push(maj);
    }

    /**
     * @notice Update majStackingPool when there is a withdraw
     * @dev called in function withdrawF
     * @param _amount is the amount to stake
     */
    function _downStackingPool(uint128 _amount) private {
        uint128 lastTotalStake = stakingTimes[stakingTimes.length - 1].stakingTotalPool;
        majStackingPool memory maj = majStackingPool(uint128(block.timestamp), lastTotalStake - _amount);
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
            uint256 _amountTokenRewards,
            uint256 _stakingTimes
        )
    {
        return (token, owner, dateStart, dateStop, amountTokenRewards, stakingTimes.length);
    }
}

// File contracts/StackingFactory.sol
