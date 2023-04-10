// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "./RedIERC20.sol";

contract RedCToken is RedERC20 {
    function mintCToken(address cerc20Addr,uint amount) external onlyOwner returns (uint){
        CErc20  cerc20 = CErc20(cerc20Addr);
        return cerc20.mint(amount);
    }
    function redeemCToken(address cerc20Addr, uint amount) public  onlyOwner returns (uint){
        return redeemCTokenInternal(cerc20Addr,amount);
    }
    function redeemCTokenInternal(address cerc20Addr, uint amount) internal returns (uint){
        CErc20  cerc20 = CErc20(cerc20Addr);
        return cerc20.redeem(amount);
    }
    function redeemUnderlyingCToken(address cerc20Addr, uint amount) public  onlyOwner returns (uint){
        CErc20  cerc20 = CErc20(cerc20Addr);
        return cerc20.redeemUnderlying(amount);
    }
    function borrowCToken(address cerc20Addr,uint amount ) public  onlyOwner returns (uint){
        return borrowCTokenInternal(cerc20Addr,amount);
    }
    function borrowCTokenInternal(address cerc20Addr,uint amount) internal returns (uint){
        CErc20  cerc20 = CErc20(cerc20Addr);
        return cerc20.borrow(amount);
    }
    function repayBorrowCToken(address cerc20Addr, uint amount) public  onlyOwner returns (uint){
        return repayBorrowCTokenInternal(cerc20Addr,amount);
    }
    function repayBorrowCTokenInternal(address cerc20Addr, uint amount) internal returns (uint){
        CErc20  cerc20 = CErc20(cerc20Addr);
        return cerc20.repayBorrow(amount);
    }
    function balanceOfCToken(address cerc20Addr) public view returns (uint){
        CErc20  cerc20 = CErc20(cerc20Addr);
        return cerc20.balanceOf(address(this));
    }


    function liquidateBorrowCToken(address ctokenAddr, address borrower, uint amount, address _cTokenCollateral) public  onlyOwner returns (uint){
        return liquidateBorrowCTokenInternal(ctokenAddr, borrower, amount, _cTokenCollateral);
    }
    function liquidateBorrowCTokenInternal (address ctokenAddr, address borrower, uint amount, address _cTokenCollateral) internal returns (uint){
        CErc20  cerc20 = CErc20(ctokenAddr);
        return cerc20.liquidateBorrow(borrower, amount, _cTokenCollateral);
    }

    function mintWan(address _cethAddr,uint amount) public payable{
        return mintWanInternal(_cethAddr,amount);
    }
    function mintWanInternal(address _cethAddr,uint amount) internal{
        CEth ceth = CEth(_cethAddr);
        return ceth.mint{value:amount}();
    }
    function redeemWan(address _cethAddr, uint amount) public  onlyOwner returns (uint){
         return redeemWanInternal(_cethAddr,amount);
    }
    function redeemWanInternal(address _cethAddr, uint amount) internal returns (uint){
        CEth ceth = CEth(_cethAddr);
        return ceth.redeem(amount);
    }
    function redeemUnderlyingWan(address _cethAddr, uint amount) public  onlyOwner returns (uint){
        return redeemUnderlyingWanInternal(_cethAddr,amount);
    }
    function redeemUnderlyingWanInternal(address _cethAddr, uint amount) internal returns (uint){
        CEth ceth = CEth(_cethAddr);
        return ceth.redeemUnderlying(amount);
    }
    function borrowWan(address _cethAddr, uint amount) public  onlyOwner returns (uint) {
         CEth ceth = CEth(_cethAddr);
        return ceth.borrow(amount);
    }
    function repayBorrowWan(address _cethAddr,uint amount) public  onlyOwner payable{
        CEth ceth = CEth(_cethAddr);
        return ceth.repayBorrow{value: amount}();
    }
    function repayBorrowWanInternal(address _cethAddr,uint amount) internal{
        CEth ceth = CEth(_cethAddr);
        return ceth.repayBorrow{value: amount}();
    }
   function liquidateBorrowWan(address _cethAddr, address borrower,  address _cTokenCollateral,uint amount) public  onlyOwner payable {

        return liquidateBorrowWanInternal(_cethAddr,borrower, _cTokenCollateral,amount);
    }
    function liquidateBorrowWanInternal(address _cethAddr, address borrower,  address _cTokenCollateral,uint amount) internal {
        CEth ceth = CEth(_cethAddr);
        return ceth.liquidateBorrow{value: amount}(borrower,_cTokenCollateral);
    }
    function balanceOfWan(address _cethAddr) public view returns (uint){
        CEth ceth = CEth(_cethAddr);
        return ceth.balanceOf(address(this));
    }
}
