// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "./RedCToken.sol";


contract RedLiquid is RedCToken {
    IUniswapV2Router02 public router;
    Comptroller public comptroller;


    string[17] TokenError=[
    "NO_ERROR",
    "UNAUTHORIZED",
    "BAD_INPUT",
    "COMPTROLLER_REJECTION",
    "COMPTROLLER_CALCULATION_ERROR",
    "INTEREST_RATE_MODEL_ERROR",
    "INVALID_ACCOUNT_PAIR",
    "INVALID_CLOSE_AMOUNT_REQUESTED",
    "INVALID_COLLATERAL_FACTOR",
    "MATH_ERROR",
    "MARKET_NOT_FRESH",
    "MARKET_NOT_LISTED",
    "TOKEN_INSUFFICIENT_ALLOWANCE",
    "TOKEN_INSUFFICIENT_BALANCE",
    "TOKEN_INSUFFICIENT_CASH",
    "TOKEN_TRANSFER_IN_FAILED",
    "TOKEN_TRANSFER_OUT_FAILED"
    ];
    /*
    borrow liquidtoken, liquid liquidToken, get collateral token, swap collateral_token  repay liquidtoken
    */
    function liquidFnSwapExactTokensForTokens(address ctokenAddr, address ctokenUnderlyingtoken, address borrower, uint amount,
        address _cTokenCollateral, address _cTokenCollateralUnderlyingTokenAddr, address[] calldata path) external  onlyOwner
    {


        //1 borrow amount underlyingToken from ctoken, get amount underlyingtoken
        uint256 ecode = borrowCTokenInternal(ctokenAddr, amount);
        require(ecode == 0, TokenError[ecode]);


        //1.5 get old collateraltoken sum;
        uint oldCtokenAmount = balanceOfCToken(_cTokenCollateral);

        //2. use amount underlyingToken liquid
        ecode = liquidateBorrowCTokenInternal(ctokenAddr,borrower,amount,_cTokenCollateral);
        require(ecode == 0, TokenError[ecode]);

        //3. after liquid operation, use get ctoken

        //4. computer the ctoken span, get the span amount , it is the liquid  value
        uint spanCTokenCollateralBalance = balanceOfCToken(_cTokenCollateral) - oldCtokenAmount;
        require(spanCTokenCollateralBalance > 0, "the ctokenCollateralBalance after liquid is zero");

        uint oldCtokenUnderlyingTokenBalance = IERC20Balance(_cTokenCollateralUnderlyingTokenAddr);

        //5. redeem the span value;

        ecode = redeemCTokenInternal(_cTokenCollateral, spanCTokenCollateralBalance);
        require(ecode == 0, TokenError[ecode]);

        //6. after redeem collateral ctoken, get the underlyingtoken in collateral ctoken balance;

        uint spanCtokenCollaterUnderlyingTokenBalance = IERC20Balance(_cTokenCollateralUnderlyingTokenAddr) - oldCtokenUnderlyingTokenBalance;

        require(spanCtokenCollaterUnderlyingTokenBalance > 0, "spanCtokenCollaterUnderlyingTokenBalance should > 0");



        router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            spanCtokenCollaterUnderlyingTokenBalance,amount, path,address(this), block.timestamp + 30);

        require(IERC20Balance(ctokenUnderlyingtoken) >= amount, "exchangeAfeterBalance should bigger than amount");


        ecode = repayBorrowCTokenInternal(ctokenAddr,amount);
        require(ecode == 0, TokenError[ecode]);

    }
    /*
      borrow token, liquid token, gain eth, redeem ceth, swap eth, reapy token
      --liquid token,
      function mintCToken(address cerc20Addr,uint amount) external onlyOwner returns (uint){
    */
    function liquidFnSwapExactETHForTokens(address ctokenAddr, address ctokenUnderlyingtoken, address borrower, uint amount,
        address _cWanCollateral, address[] calldata path) external  onlyOwner {
        //1. get cwan balance
        uint myCWanBalance = balanceOfWan(_cWanCollateral);
        require(myCWanBalance > 0, "myCWanBalance should not be 0");

        //2. borrow amount underlyingtoken in ctokenAddr,
        uint ecode = borrowCTokenInternal(ctokenAddr, amount);
        require(ecode == 0, TokenError[ecode]);


        //2.1 balance of ctokenUnderlyingtoken

        require(IERC20Balance(ctokenUnderlyingtoken)>=amount, "balance shoulde >= amount");

        //3 liquid ctoken
        ecode = liquidateBorrowCTokenInternal(ctokenAddr,borrower,amount,_cWanCollateral);
        require(ecode == 0, TokenError[ecode]);


        uint spanCWanBalance = balanceOfWan(_cWanCollateral)- myCWanBalance;
        require(spanCWanBalance > 0, "myCWanBalanceAfterLiquid should bigger then myCWanBalance");

        //4 get wan balance
        uint oldWanBalance = address(this).balance;
        //redeem cwan
        ecode = redeemWanInternal(_cWanCollateral,spanCWanBalance);
        require(ecode == 0, TokenError[ecode]);




        uint spanWanBalance = address(this).balance - oldWanBalance;
        require(spanWanBalance > 0, "spanWanBalance should bigger then 0");



        router.swapExactETHForTokensSupportingFeeOnTransferTokens{ value: spanWanBalance }(amount,path, address(this), block.timestamp + 30);

        require(IERC20Balance(ctokenUnderlyingtoken) >= amount, "exchangeAfeterBalance should bigger than amount");

        ecode = repayBorrowCTokenInternal(ctokenAddr,amount);
        require(ecode == 0, TokenError[ecode]);

    }
    /*
        because i have wan,so i do need to borrow eth
        redeem eth , liquid eth, gain token, swap token , mint eth
        --liquid wan
    */
    function liquidFnSwapExactTokensForETH(address cWanAddr, address borrower, uint amount,
        address _cTokenCollateral, address _cTokenCollateralUnderlyingTokenAddr, address[] calldata path) external  onlyOwner {


        uint ecode = borrowWan(cWanAddr,  amount);
        require(ecode == 0, TokenError[ecode]);

        require(address(this).balance > amount,"wanBalane should bigger than amount");

        uint oldCTokenCollateralBalance = balanceOfCToken(_cTokenCollateral);

        uint oldCTokenCollateralUnderyingTokenBalance = IERC20Balance(_cTokenCollateralUnderlyingTokenAddr);

        liquidateBorrowWan(cWanAddr, borrower,_cTokenCollateral,amount);

        uint spanCTokenCollateralBalance = balanceOfCToken(_cTokenCollateral) - oldCTokenCollateralBalance;


        ecode = redeemCTokenInternal(_cTokenCollateral,spanCTokenCollateralBalance);
        require(ecode == 0, TokenError[ecode]);


        uint newCTokenCollateralUnderyingTokenBalance = IERC20Balance(_cTokenCollateralUnderlyingTokenAddr);

        uint spanCTokenCollateralUnderlyingTokenBalance = newCTokenCollateralUnderyingTokenBalance - oldCTokenCollateralUnderyingTokenBalance;
        require(spanCTokenCollateralUnderlyingTokenBalance>0, "spanCTokenCollateralUnderlyingTokenBalance should bigger then 0");
        uint deadline = block.timestamp + 30;


        router.swapExactTokensForETHSupportingFeeOnTransferTokens(spanCTokenCollateralUnderlyingTokenBalance, amount, path, address(this), deadline);


        require(address(this).balance - amount > 0, "spanWanBalance should > 0");

        repayBorrowWanInternal(cWanAddr,amount);


    }

    function setRouter(IUniswapV2Router02 _router2) public onlyOwner{
        router= _router2;
    }

    function setComptroller(Comptroller _comptroller) public onlyOwner{
        comptroller = _comptroller;
    }

    function enterMarkets(address[] memory cTokens) external  onlyOwner returns (uint[] memory){

        return comptroller.enterMarkets(cTokens);

    }
}