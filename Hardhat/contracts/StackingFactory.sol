// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./Stacking.sol";

contract StackingFactory {
    Stacking[] public Contracts;

    event newPool(Stacking contrat);

    function createPool(address _token, uint256 _dateStop) public {
        Stacking stacke = new Stacking(_token, _dateStop, msg.sender);
        Contracts.push(stacke);
        emit newPool(stacke);
    }
}
