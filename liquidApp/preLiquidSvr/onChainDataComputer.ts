import config from '../config'
import {ctokenMap, comptroller,priceOracle} from '../CTokens';
import {ethers,BigNumber } from 'ethers';

import {preLogger} from '../common/logger';

const RedLiquidScAddr = config.RedControllerScAddr;
const collateralFactor = ethers.utils.parseUnits('0.6',18);
const bnUnit = ethers.utils.parseUnits('1',18);
class MarketInfo {
    amount: BigNumber;
    underlyingAmount:BigNumber;
    scAddr:string;
    underlyingScAddr:string;
    ctokenName:string;
    underlyingTokenName:string;
}
async function RedLiquidBorrowableWanAmount(){
    let cwanScAddr = config.ctokenName2Addr.w2WAN;
    let cwanScInst = ctokenMap.get(cwanScAddr);
    let borrowBalance = await cwanScInst.getAccountSnapshot(RedLiquidScAddr);
    let supplyAmount = borrowBalance[1].mul(borrowBalance[3])
        .div(ethers.utils.parseUnits('1',18));

    let borrowedable = supplyAmount.mul(collateralFactor).div(bnUnit);

    return borrowedable;


}
async function  computerOnChainAddressLiquidAmount(borrower:string){
    let underlyingTokenPriceMap = new Map(); //underlyingToken的价格， ctokenAddr->underlyingTokenPrice  : {price, decimal}
    let lastestBorrowCToken:MarketInfo = new MarketInfo();
    lastestBorrowCToken.amount = BigNumber.from('0');
    lastestBorrowCToken.scAddr = '';
    lastestBorrowCToken.underlyingScAddr = '';
    lastestBorrowCToken.ctokenName = '';
    lastestBorrowCToken.underlyingTokenName = '';

    let lastestSupplyCToken:MarketInfo = new MarketInfo();
    lastestSupplyCToken.amount = BigNumber.from('0');
    lastestSupplyCToken.scAddr = '';
    lastestSupplyCToken.underlyingScAddr = '';
    lastestSupplyCToken.ctokenName = '';
    lastestSupplyCToken.underlyingTokenName ='';

    for(let [ctokenAddr, ctokenInst] of ctokenMap){// 遍历ctoken
        let underlyingTokenPriceObj;

        let ierc20 = ctokenInst.underlyingTokenObj;
        let tempDecimal = 18;
        let decimal = 18;
        if(ierc20){
            decimal = ierc20.localDecimal;
            if(decimal< tempDecimal){
                    tempDecimal = tempDecimal + tempDecimal - decimal;
                }
            preLogger.debug('tempDecimal: ', tempDecimal);

            }


        if(underlyingTokenPriceMap.has(ctokenAddr)){
            underlyingTokenPriceObj = underlyingTokenPriceMap.get(ctokenAddr);

        }else{
            let price = await priceOracle.getUnderlyingPrice(ctokenAddr);
            preLogger.debug('price: ', price.toString());
            let ctokenName = ctokenInst.localName;
            underlyingTokenPriceObj = {
                price: price,
                decimal: tempDecimal
            };
            underlyingTokenPriceMap.set(ctokenAddr, underlyingTokenPriceObj);
        }
        
        let borrowBalance = await  ctokenInst.getAccountSnapshot(borrower);

        preLogger.debug('ctokaneName: ',ctokenInst.localName ,borrowBalance[0].toString(),
            borrowBalance[1].toString(),
            borrowBalance[2].toString(),
            borrowBalance[3].toString());


            let supplyAmount = borrowBalance[1].mul(borrowBalance[3])
            .div(ethers.utils.parseUnits('1',18));
            let borrowAmount = borrowBalance[2].mul(borrowBalance[3])
                .div(ethers.utils.parseUnits('1',18));
        preLogger.debug('ctokenName: ', ctokenInst.localName, ' supply: ', supplyAmount.toString(), ' borrow: ', borrowAmount.toString());
        

        let bnTokenUnit=ethers.utils.parseUnits('1',decimal)

        let standSupply = supplyAmount.mul(underlyingTokenPriceObj.price).mul(bnUnit).div(ethers.utils.parseUnits('1', underlyingTokenPriceObj.decimal)).div(bnTokenUnit);

        let standBorrow = borrowAmount.mul(underlyingTokenPriceObj.price).mul(bnUnit).div(ethers.utils.parseUnits('1', underlyingTokenPriceObj.decimal)).div(bnTokenUnit);

        preLogger.debug('standSupply: ', standSupply.toString());
        preLogger.debug('standBorrow: ', standBorrow.toString());

        if(lastestSupplyCToken.amount.lt(standSupply)){
            lastestSupplyCToken.amount = standSupply;
            lastestSupplyCToken.underlyingAmount = supplyAmount;
            lastestSupplyCToken.scAddr = ctokenAddr;

            lastestSupplyCToken.ctokenName = ctokenInst.localName;

            if(ierc20){
                lastestSupplyCToken.underlyingScAddr = ierc20.scAddr;
                lastestSupplyCToken.underlyingTokenName = ierc20.localName;
            }else{
                lastestSupplyCToken.underlyingScAddr = '0x0000000000000000000000000000000000000000';
                lastestSupplyCToken.underlyingTokenName = 'WAN'
            }

        }
        if(lastestBorrowCToken.amount.lt(standBorrow)){
            lastestBorrowCToken.amount = standBorrow; // use wan as unit
            lastestBorrowCToken.underlyingAmount = borrowAmount;
            lastestBorrowCToken.scAddr = ctokenAddr;
            lastestBorrowCToken.ctokenName = ctokenInst.localName;
            if(ierc20){
                lastestBorrowCToken.underlyingScAddr = ierc20.scAddr;
                lastestBorrowCToken.underlyingTokenName = ierc20.localName;
            }else{
                lastestBorrowCToken.underlyingScAddr = '0x0000000000000000000000000000000000000000';
                lastestBorrowCToken.underlyingTokenName = 'WAN';
            }
        }

        preLogger.debug('-----------------------------------------')
    }


    let borrowedable = await RedLiquidBorrowableWanAmount();

    let liquidStand = lastestBorrowCToken.amount.div(BigNumber.from('2'));
    let liquidUnderlyingTokenAmount:BigNumber;
    if(liquidStand<borrowedable){ // if balance is enough
          liquidUnderlyingTokenAmount = lastestBorrowCToken.underlyingAmount.div(BigNumber.from('2'));

    }else {
         liquidUnderlyingTokenAmount = lastestBorrowCToken.underlyingAmount.mul(borrowedable).div(liquidStand.mul(BigNumber.from('2')));
    }
    let borrowCTokenAddr = lastestBorrowCToken.scAddr;
    let borrowCTokenUnderylingTokenAddr = lastestBorrowCToken.underlyingScAddr;

    let borrowCTokenName = lastestBorrowCToken.ctokenName;
    let borrowCtokenUnderlyingTokenName = lastestBorrowCToken.underlyingTokenName;

    let supplyCTokenAddr = lastestSupplyCToken.scAddr;
    let supplyCTokenAddrUnderlyingTokenAddr = lastestSupplyCToken.underlyingScAddr;

    let supplyCTokenName = lastestSupplyCToken.ctokenName;
    let supplyCTokenUnderlyingTokenName = lastestSupplyCToken.underlyingTokenName;

    let liquidAmount = liquidUnderlyingTokenAmount;

    return {
        borrowCTokenAddr, borrowCTokenName, borrowCTokenUnderylingTokenAddr,borrowCtokenUnderlyingTokenName, supplyCTokenAddr,supplyCTokenName ,supplyCTokenAddrUnderlyingTokenAddr,supplyCTokenUnderlyingTokenName, liquidAmount
    }

}


export {
    computerOnChainAddressLiquidAmount,
    RedLiquidBorrowableWanAmount
}