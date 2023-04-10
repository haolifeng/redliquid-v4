import config from '../config';
import { BigNumber, ethers } from 'ethers';
let provider = new ethers.providers.JsonRpcProvider(config.wanChain.nodeUrl);

import admin from '../wallet';
const  RedLiquidScAddr = config.RedLiquidScAddr;

import redLiquidObj from '../RedLiquidObj/RedLiquidObj';

import {ctokenMap,comptroller} from '../CTokens';

let ctoken_wanUSDC = ctokenMap.get(config.ctokenName2Addr.w2wanUSDC);
let ctoken_wanUSDT = ctokenMap.get(config.ctokenName2Addr.w2wanUSDT);
const borrowWanUsdc = async ()=>{
    let balance = await ctoken_wanUSDC.borrowBalanceStored(RedLiquidScAddr);
    console.log('balance: ', balance.toString());
    let usdtbalance = await ctoken_wanUSDC.borrowBalanceStored(RedLiquidScAddr);
    console.log('balance: ', usdtbalance.toString());
}

borrowWanUsdc();
