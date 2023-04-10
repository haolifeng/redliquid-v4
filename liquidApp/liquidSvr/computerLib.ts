import CTokenData from "./CTokenData";
import {BigNumber, ethers} from "ethers";

import {logger} from "../common/logger";
import storage from "../db";

import config from '../config';
import accountData from "./AccountData";
import {ctokenMap} from "../CTokens";
import {txMap, txStateMap} from "../common/libs";
const underlyingTokenInfo = config.underlyingTokenInfo;
const RedLiquidScAddr = config.RedControllerScAddr;
const bnUnit18 = ethers.utils.parseUnits('1', 18);
//good
async function mostValueMarket(borrowMarkets: CTokenData[]):Promise<number>{
    let index = -1;
    try{
        let marketSize = borrowMarkets.length;
        console.log('0 -- marketSize: ', marketSize)
        if(marketSize === 0){
            return -1;
        }
        if(marketSize===1){
            let borrowMarket = borrowMarkets[0];
            let BorrowCTokenAddress = borrowMarket.cTokenAddress;
            let bBalance = borrowMarket.underlyTokenAmount;

            let underlyingScInst = borrowMarket.underlyingScInst;

            let underlyingTokenDecimal = 18
            if (underlyingScInst){
                underlyingTokenDecimal = underlyingScInst.localDecimal;
            }
            console.log('BorrowCTokenAddress: ', BorrowCTokenAddress);
            console.log('bBalance: ', bBalance);
            console.log('underlyingTokenDecimal: ', underlyingTokenDecimal);


            let mixValue = ethers.utils.parseUnits(bBalance,underlyingTokenDecimal);

            if(mixValue.eq(BigNumber.from(1))){
                logger.info('the balance is too small, the balance is : ', bBalance);
                return -1;
            }

            return 0;
        }

        let bnMostValue = BigNumber.from('0');
        for(let i = 0; i< marketSize; i++) {
            let borrowMarket = borrowMarkets[i];
            let BorrowCTokenAddress = borrowMarket.cTokenAddress;
            let bBalance = borrowMarket.underlyTokenAmount;
            console.log('borrowCTokenAddress : ',BorrowCTokenAddress)
            console.log('bBalance: ', bBalance)

            let underlyingScInst = borrowMarket.underlyingScInst;
            let underlyingTokenDecimal = 18
            if (underlyingScInst){
                underlyingTokenDecimal = underlyingScInst.localDecimal;
            }


            let mixValue = ethers.utils.parseUnits(bBalance,underlyingTokenDecimal);
            console.log('1 -- mixValue: -- ', mixValue.toString())
            if(mixValue.eq(BigNumber.from(1))){
                logger.info('the balance is too small, the balance is : ', bBalance);
                continue;
            }


            let priceDoc = await storage.getCTokenUnderlyingPrice(BorrowCTokenAddress);
            if(priceDoc){
                console.log('priceDoc.price: ', priceDoc.price)
                console.log('priceDoc.decimal: ', priceDoc.decimal)

                let bnPrice = BigNumber.from(priceDoc.price);
                let bnBalance = ethers.utils.parseUnits(bBalance, 18);
                let bnDecimal = ethers.utils.parseUnits('1', priceDoc.decimal);

                console.log('bnPrice: ', bnPrice.toString())
                console.log('bnBalance: ', bnBalance.toString())
                console.log('bnDecimal: ', bnDecimal.toString())


                // let bnBorrowMarketValue = BigNumber.from(priceDoc.price).mul(ethers.utils.parseUnits(bBalance, 18)).div(ethers.utils.parseUnits('1', priceDoc.decimal))
                let bnBorrowMarketValue = bnPrice.mul(bnBalance).div(bnDecimal);

                console.log('bnBorrowMarketValue: ', bnBorrowMarketValue.toString())

                if(bnBorrowMarketValue.gt(bnMostValue)){
                    bnMostValue = bnBorrowMarketValue;
                    index = i;
                }
            }
            console.log('----------------------------------------------------')
        }
    }catch (e) {
        console.log('e: ', e)
        logger.error(e);
        return 0;
    }


    return index;
}


async function computerActualRepayAmountFloatFromUnderlyAmount(
    bnCollateralCtokenAmount:BigNumber,
    CollateralCTokenAddress:string,
    CollateralCTokenUnderlyingTokenDecimal:number,
    BorrowCTokenAddress:string,
    BorrowCTokenUnderlyingTokenDecimal:number,
    ){

        let bnUnit = ethers.utils.parseUnits('1',18);


    let priceCollateralDoc = await storage.getCTokenUnderlyingPrice(CollateralCTokenAddress);
    logger.debug('computerActualRepayAmountFloatFromUnderlyAmount -- 0 -- priceCollateralDoc: ', priceCollateralDoc);
    if(!priceCollateralDoc){
        return null;
    }
    let bnCollaterPrice_price  = BigNumber.from(priceCollateralDoc.price);
    let bnCollaterPrice_decimal = priceCollateralDoc.decimal;
    let bnCollaterPrice_price_Uint = ethers.utils.parseUnits('1', bnCollaterPrice_decimal);
    


    let priceBorrowedDoc = await storage.getCTokenUnderlyingPrice(BorrowCTokenAddress);
    logger.info('computerActualRepayAmountFloatFromUnderlyAmount -- 1 -- priceBorrowedDoc: ', priceBorrowedDoc);
    if(!priceBorrowedDoc){
        return ;
    }

    let bnBorrowedPrice_price  = BigNumber.from(priceBorrowedDoc.price);
    let bnBorrowedPrice_decimal = priceBorrowedDoc.decimal;
    let bnBorrowedPrice_price_Uint = ethers.utils.parseUnits('1', bnBorrowedPrice_decimal);



    let strLiquidationIncentive = await storage.getLiquidationIncentive();
    let bnliquidationIncentive = BigNumber.from(strLiquidationIncentive);



    logger.info('computerActualRepayAmountFloatFromUnderlyAmount --3.1 bnliquidationIncentive: ', bnliquidationIncentive.toString());


    let bnCollatorValue = bnCollateralCtokenAmount.mul(bnCollaterPrice_price).mul(bnUnit).mul(bnBorrowedPrice_price_Uint).mul(ethers.utils.parseUnits('1', BorrowCTokenUnderlyingTokenDecimal));
    let bnBorrowValue = bnliquidationIncentive.mul(bnBorrowedPrice_price).mul(bnCollaterPrice_price_Uint).mul(ethers.utils.parseUnits('1', CollateralCTokenUnderlyingTokenDecimal));

    

    let bnActualRepayAmount = bnCollatorValue.div(bnBorrowValue);

    logger.info('computerActualRepayAmountFloatFromUnderlyAmount --3.2 bnActualRepayAmount: ', bnActualRepayAmount.toString());

    return bnActualRepayAmount;
}
async function selectSeizeCollateralCToken(collateralMarkets: CTokenData[], liquidMarkets:CTokenData):Promise<any>{
    let indexTemp = -1;
    let bnMostActualRepayAmountTemp = BigNumber.from('0');
    for(let i = 0; i< collateralMarkets.length;i++){
        let collateralMarket = collateralMarkets[i];
        let collateralCTokenUnderlyAmount = collateralMarket.underlyTokenAmount;
        let collateralCTokenAddress = collateralMarket.cTokenAddress;

        

        let collaterulUnderlyingScInst = collateralMarket.underlyingScInst;

        let collateralDecimal = 18;
        if(collaterulUnderlyingScInst){
            collateralDecimal = collaterulUnderlyingScInst.localDecimal;
        }
        let bnCollateralCtokenUnderlyAmount = ethers.utils.parseUnits(collateralCTokenUnderlyAmount, collateralDecimal);

        if(bnCollateralCtokenUnderlyAmount.eq(BigNumber.from(1))){
            continue;
        }

        logger.debug('selectSeizeCollateralCToken  -- bnCollateralCtokenUnderlyAmount: ',bnCollateralCtokenUnderlyAmount.toString());

        let liquidMarketsTokenAddr  = liquidMarkets.cTokenAddress;
        let liquidUnderlyingScInst = liquidMarkets.underlyingScInst;

        let liquidDecimal = 18;
        if(liquidUnderlyingScInst){
            liquidDecimal = liquidUnderlyingScInst.localDecimal;
        }




        let bnAcutalRepayAmount =  await computerActualRepayAmountFloatFromUnderlyAmount(bnCollateralCtokenUnderlyAmount,collateralCTokenAddress,collateralDecimal,liquidMarketsTokenAddr,liquidDecimal);
        if(bnAcutalRepayAmount.gt(bnMostActualRepayAmountTemp)){
            bnMostActualRepayAmountTemp = bnAcutalRepayAmount;
            indexTemp = i;
        }

        console.info(`========================================selectSeizeCollateralCToken ${i} ==================================================`)

    }
    return {
        indexTemp,
        bnMostActualRepayAmountTemp
    }
}

async function computeBorrowAmountFromCollateWan(liquidMarketData :CTokenData ){
    const borrowCtokenAddr = liquidMarketData.cTokenAddress
    const borrowUnderlyingTokenInst = liquidMarketData.underlyingScInst
    let borrowUnderlyingTokenDecimal = 18;
    if(borrowUnderlyingTokenInst){
        borrowUnderlyingTokenDecimal = borrowUnderlyingTokenInst.localDecimal
    }
    let borrowUnderlyingTokenUnit = ethers.utils.parseUnits('1', borrowUnderlyingTokenDecimal)

    const bnUnit = ethers.utils.parseUnits('1',18);
    let ctokenName = 'w2WAN';
    let ctokenAddr = '0x48c42529c4c8e3d10060e04240e9ec6cd0eb1218';
    let userAddr = RedLiquidScAddr;
    let cWanBalance = await storage.getCTokenBalance(ctokenName,ctokenAddr, userAddr);
    if(!cWanBalance){
        return null;
    }
    let bnCWanBalance = BigNumber.from(cWanBalance);


    let cWanExchange = await storage.getExchangeRate(ctokenAddr);
    if(!cWanExchange){
        return null;
    }
    let bnCWanExchange = BigNumber.from(cWanExchange);
    let bnCWanExchangeUnit = bnUnit;

    let t1 = bnCWanBalance.mul(bnCWanExchange).div(bnCWanExchangeUnit);
    logger.info('t1 : ', ethers.utils.formatEther(t1));


    let cWanMarketEvn = await storage.getMarketEnv(ctokenAddr);
    if(!cWanMarketEvn){
        return null;
    }
    let collaterFactor = cWanMarketEvn.collateralFactorMantissa;
    let bnCollaterFactor = BigNumber.from(collaterFactor);
    let bnCollaterFactorUnit = bnUnit;



    let cWanUnderlyingTokenPrice = await storage.getCTokenUnderlyingPrice(ctokenAddr);

    let cWanUnderlyingTokenPrice_price = BigNumber.from(cWanUnderlyingTokenPrice.price);

    let cWanUnderlyingTokenPriceUnit = bnUnit;


    let borrowCtokenUnderlyingTokenPrice = await storage.getCTokenUnderlyingPrice(borrowCtokenAddr);

    let borrowCtokenUnderlyingTokenPrice_price = BigNumber.from(borrowCtokenUnderlyingTokenPrice.price);
    let borrowCtokenUnderlyingTokenPrice_decimal = borrowCtokenUnderlyingTokenPrice.decimal;
    let bnBorrowCtokenUnderyingTokenPriceUnit = ethers.utils.parseUnits('1', borrowCtokenUnderlyingTokenPrice_decimal);



    console.log('bnCWanBalance: ', bnCWanBalance.toString())
    console.log('bnCWanExchange: ', bnCWanExchange.toString())
    console.log('cWanUnderlyingTokenPrice_price: ', cWanUnderlyingTokenPrice_price.toString())
    console.log('bnCollaterFactor: ', bnCollaterFactor.toString())
    console.log('bnBorrowCtokenUnderyingTokenPriceUnit', bnBorrowCtokenUnderyingTokenPriceUnit.toString())



    let upNum = bnCWanBalance.mul(bnCWanExchange).mul(cWanUnderlyingTokenPrice_price).mul(bnCollaterFactor).mul(bnBorrowCtokenUnderyingTokenPriceUnit).mul(borrowUnderlyingTokenUnit);

    //let downNum = bnUnit.mul(cWanUnderlyingTokenPriceUnit).mul(bnUnit).mul(borrowCtokenUnderlyingTokenPrice_price)

    let downNum = bnCWanExchangeUnit.mul(cWanUnderlyingTokenPriceUnit).mul(bnCollaterFactorUnit).mul(borrowCtokenUnderlyingTokenPrice_price).mul(bnUnit)

    let bnBorrowAmount = upNum.div(downNum);
    return bnBorrowAmount;

}
async function computeBorrowAmountFromAllCollateUnderlyingToken(userAddr :string, liquidMarketData :CTokenData ){
    const bnUnit = ethers.utils.parseUnits('1',18);
    //let userAddr = RedLiquidScAddr;

    const borrowCtokenAddr = liquidMarketData.cTokenAddress
    const borrowUnderlyingTokenInst = liquidMarketData.underlyingScInst
    let borrowUnderlyingTokenDecimal = 18;
    if(borrowUnderlyingTokenInst){
        borrowUnderlyingTokenDecimal = borrowUnderlyingTokenInst.localDecimal
    }
    console.log('0 -- borrowUnderlyingTokenDecimal: ', borrowUnderlyingTokenDecimal);
    let borrowUnderlyingTokenUnit = ethers.utils.parseUnits('1', borrowUnderlyingTokenDecimal);

    let sumCollaterValue = BigNumber.from('0')
    for(let [ctokenAddr, ctokenInst] of ctokenMap){
        let ctokenName = ctokenInst.localName;
        console.log('ctokenName: ', ctokenName)

        let ctokenBalance = await storage.getCTokenBalance(ctokenName,ctokenAddr, userAddr.toLowerCase());
        console.log('1 -- ctokenBalance: ', ctokenBalance);
        if(!ctokenBalance){
            continue;
        }

        let bnCTokenBalance = BigNumber.from(ctokenBalance);
        let bnCtokenBalanceUnit = bnUnit;


        let cTokenExchange = await storage.getExchangeRate(ctokenAddr);
        console.log('2 -- cTokenExchange: ', cTokenExchange);
        if(!cTokenExchange){
            continue;
        }
        let bnCTokenExchange = BigNumber.from(cTokenExchange);
        let bnCTokenExchangeUnit = bnUnit;
        console.log('3.1 -- ctokenAddr: ', ctokenAddr)
        let cTokenMarketEvn = await storage.getMarketEnv(ctokenAddr);

        console.log('3 -- cTokenMarketEvn: ', cTokenMarketEvn);
        if(!cTokenMarketEvn){
            return null;
        }
        let collaterFactor = cTokenMarketEvn.collateralFactorMantissa;
        let bnCollaterFactor = BigNumber.from(collaterFactor);
        let bnCollaterFactorUnit = bnUnit;
        console.log('4 -- bnCollaterFactor: ', bnCollaterFactor.toString());
        if(bnCollaterFactor.eq(BigNumber.from('0'))){
            continue;
        }

        let cTokenUnderlyingTokenPrice = await storage.getCTokenUnderlyingPrice(ctokenAddr);
        let cTokenUnderlyingTokenPrice_price = BigNumber.from(cTokenUnderlyingTokenPrice.price);
        let cTokenUnderlyingTokenPrice_decimal = ethers.utils.parseUnits('1', cTokenUnderlyingTokenPrice.decimal);
        console.log('5 -- cTokenUnderlyingTokenPrice_price: ', cTokenUnderlyingTokenPrice_price.toString());
        if(cTokenUnderlyingTokenPrice_price.eq(BigNumber.from('0'))){
            continue;
        }


        let t1 = bnCTokenBalance.mul(bnCTokenExchange).mul(bnCollaterFactor).div(bnCtokenBalanceUnit.mul(bnCTokenExchangeUnit).mul(bnCollaterFactorUnit));

        console.log('6 -- ctoken collaterUnderlyingToken number: ', t1.toString());

        let sum = bnCTokenBalance.mul(bnCTokenExchange).mul(bnCollaterFactor).mul(cTokenUnderlyingTokenPrice_price).div(bnCtokenBalanceUnit.mul(bnCTokenExchangeUnit).mul(bnCollaterFactorUnit).mul(cTokenUnderlyingTokenPrice_decimal));
        console.log("7 -- cotken collaterUnderlyingToken value (number * price): ", sum.toString());
        sumCollaterValue = sumCollaterValue.add(sum);
    }

    let borrowCtokenUnderlyingTokenPrice = await storage.getCTokenUnderlyingPrice(borrowCtokenAddr);

    let borrowCtokenUnderlyingTokenPrice_price = BigNumber.from(borrowCtokenUnderlyingTokenPrice.price);
    let borrowCtokenUnderlyingTokenPrice_decimal = borrowCtokenUnderlyingTokenPrice.decimal;
    let bnBorrowCtokenUnderyingTokenPriceUnit = ethers.utils.parseUnits('1', borrowCtokenUnderlyingTokenPrice_decimal);

    console.log("8 -- cotken collaterUnderlyingToken sumCollaterValue : ", sumCollaterValue.toString());
    let bnBorrowAmount = sumCollaterValue.mul(bnBorrowCtokenUnderyingTokenPriceUnit).mul(borrowUnderlyingTokenUnit).div(borrowCtokenUnderlyingTokenPrice_price);
    console.log("9 -- cotken collaterUnderlyingToken sumCollaterValue : ", sumCollaterValue.toString());
    return bnBorrowAmount;
}
async function computeBorrowAmountFromAllCollateUnderlyingTokenByRedController(liquidMarketData :CTokenData ){
    const bnUnit = ethers.utils.parseUnits('1',18);
    let userAddr = RedLiquidScAddr;

    const borrowCtokenAddr = liquidMarketData.cTokenAddress
    const borrowUnderlyingTokenInst = liquidMarketData.underlyingScInst
    let borrowUnderlyingTokenDecimal = 18;
    if(borrowUnderlyingTokenInst){
        borrowUnderlyingTokenDecimal = borrowUnderlyingTokenInst.localDecimal
    }
    console.log('0 -- borrowUnderlyingTokenDecimal: ', borrowUnderlyingTokenDecimal);
    let borrowUnderlyingTokenUnit = ethers.utils.parseUnits('1', borrowUnderlyingTokenDecimal);

    let sumCollaterValue = BigNumber.from('0')
    for(let [ctokenAddr, ctokenInst] of ctokenMap){
        let ctokenName = ctokenInst.localName;
        console.log('ctokenName: ', ctokenName)

        let ctokenBalance = await storage.getCTokenBalance(ctokenName,ctokenAddr, userAddr.toLowerCase());
        console.log('1 -- ctokenBalance: ', ctokenBalance);
        if(!ctokenBalance){
            continue;
        }

        let bnCTokenBalance = BigNumber.from(ctokenBalance);
        let bnCtokenBalanceUnit = bnUnit;


        let cTokenExchange = await storage.getExchangeRate(ctokenAddr);
        console.log('2 -- cTokenExchange: ', cTokenExchange);
        if(!cTokenExchange){
            continue;
        }
        let bnCTokenExchange = BigNumber.from(cTokenExchange);
        let bnCTokenExchangeUnit = bnUnit;
        console.log('3.1 -- ctokenAddr: ', ctokenAddr)
        let cTokenMarketEvn = await storage.getMarketEnv(ctokenAddr);

        console.log('3 -- cTokenMarketEvn: ', cTokenMarketEvn);
        if(!cTokenMarketEvn){
            return null;
        }
        let collaterFactor = cTokenMarketEvn.collateralFactorMantissa;
        let bnCollaterFactor = BigNumber.from(collaterFactor);
        let bnCollaterFactorUnit = bnUnit;
        console.log('4 -- bnCollaterFactor: ', bnCollaterFactor.toString());
        if(bnCollaterFactor.eq(BigNumber.from('0'))){
            continue;
        }

        let cTokenUnderlyingTokenPrice = await storage.getCTokenUnderlyingPrice(ctokenAddr);
        let cTokenUnderlyingTokenPrice_price = BigNumber.from(cTokenUnderlyingTokenPrice.price);
        let cTokenUnderlyingTokenPrice_decimal = ethers.utils.parseUnits('1', cTokenUnderlyingTokenPrice.decimal);
        console.log('5 -- cTokenUnderlyingTokenPrice_price: ', cTokenUnderlyingTokenPrice_price.toString());
        if(cTokenUnderlyingTokenPrice_price.eq(BigNumber.from('0'))){
            continue;
        }


        let t1 = bnCTokenBalance.mul(bnCTokenExchange).mul(bnCollaterFactor).div(bnCtokenBalanceUnit.mul(bnCTokenExchangeUnit).mul(bnCollaterFactorUnit));

        console.log('6 -- ctoken collaterUnderlyingToken number: ', t1.toString());

        let sum = bnCTokenBalance.mul(bnCTokenExchange).mul(bnCollaterFactor).mul(cTokenUnderlyingTokenPrice_price).div(bnCtokenBalanceUnit.mul(bnCTokenExchangeUnit).mul(bnCollaterFactorUnit).mul(cTokenUnderlyingTokenPrice_decimal));
        console.log("7 -- cotken collaterUnderlyingToken value (number * price): ", sum.toString());
        sumCollaterValue = sumCollaterValue.add(sum);
    }

    let borrowCtokenUnderlyingTokenPrice = await storage.getCTokenUnderlyingPrice(borrowCtokenAddr);

    let borrowCtokenUnderlyingTokenPrice_price = BigNumber.from(borrowCtokenUnderlyingTokenPrice.price);
    let borrowCtokenUnderlyingTokenPrice_decimal = borrowCtokenUnderlyingTokenPrice.decimal;
    let bnBorrowCtokenUnderyingTokenPriceUnit = ethers.utils.parseUnits('1', borrowCtokenUnderlyingTokenPrice_decimal);

    console.log("8 -- cotken collaterUnderlyingToken sumCollaterValue : ", sumCollaterValue.toString());
    let bnBorrowAmount = sumCollaterValue.mul(bnBorrowCtokenUnderyingTokenPriceUnit).mul(borrowUnderlyingTokenUnit).div(borrowCtokenUnderlyingTokenPrice_price);
    console.log("9 -- cotken collaterUnderlyingToken sumCollaterValue : ", sumCollaterValue.toString());
    return bnBorrowAmount;
}

async function computePayAmountBaseBorrowAmount(liquidMarketData:CTokenData){
    let liquidMarket_borrowBalance = liquidMarketData.underlyTokenAmount;

    let decimal = 18;
    let liquidMarket_underlyingSc = liquidMarketData.underlyingScInst;

    if(liquidMarket_underlyingSc){
        decimal = liquidMarket_underlyingSc.localDecimal;
    }


    let bnBorrowMarket_borrowBalance = ethers.utils.parseUnits(liquidMarket_borrowBalance, decimal);

    let closeFactor = await storage.getCloseFactor();
    let bnCloseFactor = BigNumber.from(closeFactor);
    let bnUnit = ethers.utils.parseUnits('1',18);


    let bnMostActualRepayAmount: BigNumber = bnBorrowMarket_borrowBalance.mul(bnCloseFactor).div(bnUnit);
    bnMostActualRepayAmount = bnMostActualRepayAmount.sub(BigNumber.from(1));
    return bnMostActualRepayAmount;
}

async function computeMostValueAccount(txMap :Map<string, accountData>) {
    let mostValueAccount :string;
    let mostValueInWan :BigNumber = BigNumber.from(0);
    let mostLiquidMarketData :CTokenData;
    let mostCollateralMarketData :CTokenData;
    let theMostActulaRepayAmount : BigNumber = BigNumber.from(0);

    for (let [userAddr, accountData] of txMap) {
        try {
            let mostIndex = await mostValueMarket(accountData.borrowTokens);
            if (mostIndex < 0) {
                logger.info(' mostIndex <0 ---------------------------------------------------------------- return ')

                continue;
            }
            logger.info('0 -- the select Borrow Market is -  mostIndex :', mostIndex);
            let liquidMarketData = accountData.borrowTokens[mostIndex];

            let bnMostActualRepayAmount = await computePayAmountBaseBorrowAmount(liquidMarketData);

            logger.info(' 0.5 -- from BorrowMarket: bnMostActualReapyAmount : ', bnMostActualRepayAmount.toString());




            let {indexTemp, bnMostActualRepayAmountTemp} = await selectSeizeCollateralCToken(accountData.supplyTokens, liquidMarketData);
            if (indexTemp < 0) {
                logger.info(' indexTmp <0 --------------------------------------------------------------------return ')
                continue;
            }


            logger.info("1-- the supplyMarket is:", indexTemp);

            logger.info('1.5 -- from supplyMarket: bnMostActualRepayAmountTemp : ', bnMostActualRepayAmountTemp.toString());

            let myBalance = await computeBorrowAmountFromAllCollateUnderlyingTokenByRedController(liquidMarketData);
            if (!myBalance) {
                logger.info(' myBalance == null --------------------------------------------------------------------return ');

                continue;
            }

            logger.info('2 -- from  myBalance : ', myBalance.toString());
            if (myBalance.lt(bnMostActualRepayAmount)) {
                bnMostActualRepayAmount = myBalance;
            }

            if (bnMostActualRepayAmountTemp.lt(bnMostActualRepayAmount)) {
                bnMostActualRepayAmount = bnMostActualRepayAmountTemp;
            }




            let index = indexTemp;
            let collateMarketData = accountData.supplyTokens[index];
            if (bnMostActualRepayAmount.eq(BigNumber.from('0'))) {
                logger.info('0 --------------------------------------------------------------------------------------return ')

                continue;
            }
           // logger.info('BEGIN-LIQUID -- collateMarketName: ', collateMarketName, '<-> liquidMarketName: ', liquidMarketName, 'bnMostActualRepayAmount: ', bnMostActualRepayAmount.toString())





            let liquidCtokenUnderlyingTokenPrice = await storage.getCTokenUnderlyingPrice(liquidMarketData.cTokenAddress);

            let liquidCtokenUnderlyingTokenPrice_price = BigNumber.from(liquidCtokenUnderlyingTokenPrice.price);
            let liquidCtokenUnderlyingTokenPrice_decimal = liquidCtokenUnderlyingTokenPrice.decimal;
            let bnBorrowCtokenUnderyingTokenPriceUnit = ethers.utils.parseUnits('1', liquidCtokenUnderlyingTokenPrice_decimal);

            let valueInWanUnit = bnMostActualRepayAmount.mul(liquidCtokenUnderlyingTokenPrice_price).mul(bnUnit18).div(bnBorrowCtokenUnderyingTokenPriceUnit);
            if (mostValueInWan.lt(valueInWanUnit)){
                mostValueInWan = valueInWanUnit;
                mostValueAccount = userAddr;
                mostLiquidMarketData = liquidMarketData;
                mostCollateralMarketData = collateMarketData;
                theMostActulaRepayAmount = bnMostActualRepayAmount

            }


        } catch (e) {

        }

    }
    return {
        mostValueAccount,mostLiquidMarketData,mostCollateralMarketData,theMostActulaRepayAmount
    }
}
export {
    mostValueMarket,
    selectSeizeCollateralCToken,
    computeBorrowAmountFromCollateWan,
    computerActualRepayAmountFloatFromUnderlyAmount,
    computePayAmountBaseBorrowAmount,
    computeBorrowAmountFromAllCollateUnderlyingToken,
    computeBorrowAmountFromAllCollateUnderlyingTokenByRedController
}