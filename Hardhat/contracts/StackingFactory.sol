// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./Stacking.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

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
}
