import {txMap, txStateMap} from "../common/libs";

import {logger} from "../common/logger";
import redLiquidObj from "../RedLiquidObj/RedLiquidObj";
import {
    mostValueMarket,
    selectSeizeCollateralCToken,
    computePayAmountBaseBorrowAmount,
    computeBorrowAmountFromCollateWan,
    computeBorrowAmountFromAllCollateUnderlyingToken,
    computeBorrowAmountFromAllCollateUnderlyingTokenByRedController
} from './computerLib';
import {BigNumber, ethers} from "ethers";
import admin from "../wallet";
import config from '../config';

class LiquidSvr {
    constructor(){

    }
    async run(){
        if(txMap.size > 0){
            for(let [userAddr, accountData] of txMap){
                try{
                    if(txStateMap.has(userAddr)){//already handle
                        continue;
                    }
                    logger.info('==================================================   head ')
                    logger.info('userAddress: ', userAddr, ' health: ', accountData.health);

                    logger.info('============================ begin liquid ======================    ');


                    let mostIndex = await mostValueMarket(accountData.borrowTokens);
                    if(mostIndex <0){
                        logger.info(' mostIndex <0 ---------------------------------------------------------------- return ')
                        if(!txStateMap.has(userAddr)){
                            txStateMap.set(userAddr,false);
                        }
                        continue;
                    }
                    logger.info('0 -- the select Borrow Market is -  mostIndex :', mostIndex);
                    let liquidMarketData = accountData.borrowTokens[mostIndex];

                    let bnMostActualRepayAmount = await computePayAmountBaseBorrowAmount(liquidMarketData);

                    logger.info(' 0.5 -- from BorrowMarket: bnMostActualReapyAmount : ', bnMostActualRepayAmount.toString());

                    //bnMostActualRepayAmount = bnMostActualRepayAmount.mul(BigNumber.from('3')).div(BigNumber.from('4'));



                    let {indexTemp,bnMostActualRepayAmountTemp } = await selectSeizeCollateralCToken(accountData.supplyTokens,liquidMarketData);
                    if(indexTemp<0){
                        logger.info(' indexTmp <0 --------------------------------------------------------------------return ')
                        if(!txStateMap.has(userAddr)){
                            txStateMap.set(userAddr,false);
                        }
                        continue;
                    }



                    logger.info("1-- the supplyMarket is:", indexTemp);

                    logger.info('1.5 -- from supplyMarket: bnMostActualRepayAmountTemp : ', bnMostActualRepayAmountTemp.toString());
                    //bnMostActualRepayAmountTemp = bnMostActualRepayAmountTemp.mul(BigNumber.from('3')).div(BigNumber.from('4'));

                    let myBalance = await computeBorrowAmountFromCollateWan(liquidMarketData);
                    myBalance = await computeBorrowAmountFromAllCollateUnderlyingTokenByRedController(liquidMarketData );
                    if(!myBalance){
                        logger.info(' myBalance == null --------------------------------------------------------------------return ');
                        if(!txStateMap.has(userAddr)){
                            txStateMap.set(userAddr,false);
                        }
                        continue;
                    }

                    logger.info('2 -- from  myBalance : ', myBalance.toString());

                    await accountData.walkBorrowTokens();
                    await accountData.walkSupplyTokens();

                    if(myBalance.lt(bnMostActualRepayAmount)){
                        bnMostActualRepayAmount = myBalance;
                    }

                    if(bnMostActualRepayAmountTemp.lt(bnMostActualRepayAmount)){
                        bnMostActualRepayAmount = bnMostActualRepayAmountTemp;
                    }


                    let index = indexTemp;
                    let collateMarketData = accountData.supplyTokens[index];

                    let collateMarketName = collateMarketData.cTokenName;
                    let liquidMarketName = liquidMarketData.cTokenName;

                    logger.info('3 -- collateMarketName: ',collateMarketName , '<-> liquidMarketName: ', liquidMarketName,'bnMostActualRepayAmount: ',bnMostActualRepayAmount.toString())

                    if(bnMostActualRepayAmount.eq(BigNumber.from('0'))){
                        logger.info('0 --------------------------------------------------------------------------------------return ')
                        if(!txStateMap.has(userAddr)){
                            txStateMap.set(userAddr,false);
                        }
                        continue ;
                    }





                    logger.info('BEGIN-LIQUID -- collateMarketName: ',collateMarketName , '<-> liquidMarketName: ', liquidMarketName,'bnMostActualRepayAmount: ',bnMostActualRepayAmount.toString())
                    if(liquidMarketName === 'w2WAND' || liquidMarketName === 'w2ZOO'){
                        continue;
                    }
                    if(collateMarketName=== 'w2WAN' && liquidMarketName!== 'w2WAN'){
                        let headUnderlyingTokenName = 'WAN';
                        let endUnderlyingTokenName = liquidMarketData.underlyingScInst.localName;
                        let path = config.paths[headUnderlyingTokenName + '2' + endUnderlyingTokenName];
                        logger.info(headUnderlyingTokenName + '2' + endUnderlyingTokenName);
                        logger.info(path);
                        
                       let ret = await redLiquidObj.liquidFnSwapExactETHForTokens(admin,
                            liquidMarketData.cTokenAddress,
                            liquidMarketData.underlyTokenAddress,
                            userAddr,
                            bnMostActualRepayAmount,
                            collateMarketData.cTokenAddress,
                            path);

                            logger.info("0-END-LIQUID, ret", ret);
                            

                    }
                    else if(collateMarketName !== 'w2WAN' && liquidMarketName === 'w2WAN'){
                        let headUnderlyingTokenName = collateMarketData.underlyingScInst.localName;
                        let endUnderlyingTokenName = 'WAN';
                        let path = config.paths[headUnderlyingTokenName + '2' + endUnderlyingTokenName];
                        logger.info(headUnderlyingTokenName + '2' + endUnderlyingTokenName);
                        logger.info(path);

                        let ret = await redLiquidObj.liquidFnSwapExactTokensForETH(admin,
                            liquidMarketData.cTokenAddress,
                            userAddr,
                            bnMostActualRepayAmount,
                            collateMarketData.cTokenAddress,
                            collateMarketData.underlyTokenAddress,
                            path);
                        logger.info("1-END-LIQUID, ret", ret);



                    }
                    else if(collateMarketName !== 'w2WAN' && liquidMarketName !== 'w2WAN'){

                        let headUnderlyingTokenName = collateMarketData.underlyingScInst.localName;
                        let endUnderlyingTokenName = liquidMarketData.underlyingScInst.localName;
                        let path = config.paths[headUnderlyingTokenName + '2' + endUnderlyingTokenName];
                        logger.info('path: ', path);
                        let ret = await redLiquidObj.liquidFnSwapExactTokensForTokens(admin,liquidMarketData.cTokenAddress,
                            liquidMarketData.underlyTokenAddress,
                            userAddr,bnMostActualRepayAmount,collateMarketData.cTokenAddress,collateMarketData.underlyTokenAddress,path
                            )

                        logger.info('2-END-LIQUID, ret: ', ret);
                       
                    }
                    if(!txStateMap.has(userAddr)){
                        txStateMap.set(userAddr,true);
                    }


                }catch(e){
                    logger.info('e: ',e);
                    if(!txStateMap.has(userAddr)){
                        txStateMap.set(userAddr,false);
                    }

                }


                logger.info('============================ end liquid ======================    ');
            }
        }
    }
}
let liquidSvr = new LiquidSvr();
export default liquidSvr;