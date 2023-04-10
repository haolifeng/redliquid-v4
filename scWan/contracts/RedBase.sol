// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "./AdminStorage.sol";
import "./IUniswapV2Router02.sol";
import "./Interface.sol";
contract RedBase is AdminStorage {


    constructor() {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function sendWan(address payable other,uint amount) public onlyOwner {
        address myAddress = address(this);
        if(myAddress.balance > amount ){
            other.transfer(amount);
        }
    }
}

    
