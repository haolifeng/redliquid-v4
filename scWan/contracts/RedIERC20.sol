// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "./RedBase.sol";

contract RedERC20 is RedBase {

    function IERC20transfer(address ierc20, address recipient, uint amount) external onlyOwner returns (bool){
        IERC20 erc20 = IERC20(ierc20);
        uint256 myBalance = erc20.balanceOf(address(this));
        require(amount !=0, "amount should bigger than 0");
        require(myBalance > amount, "balance shoud bigger than amount");
        return erc20.transfer(recipient,amount);
    }
    function IERC20Approve(address ierc20, address spender, uint amount) external onlyOwner returns (bool){
        IERC20 erc20 = IERC20(ierc20);
        return erc20.approve(spender, amount);

    }
    function IERC20Balance(address ierc20) public  view returns (uint){
        IERC20 erc20 = IERC20(ierc20);
        return erc20.balanceOf(address(this));
    }
    
 
}


