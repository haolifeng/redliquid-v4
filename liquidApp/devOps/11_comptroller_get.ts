import config from '../config';
import { BigNumber, ethers } from 'ethers';
let provider = new ethers.providers.JsonRpcProvider(config.wanChain.nodeUrl);

import admin from '../wallet';
const  RedLiquidScAddr = config.RedLiquidScAddr;

import redLiquidObj from '../RedLiquidObj/RedLiquidObj';

import {ctokenMap,comptroller} from '../CTokens';

const CWanScAddr = config.ctokenName2Addr.w2WAN;
const CToken_w2wanUSDC_ScAddr = config.ctokenName2Addr.w2wanUSDT;
let data ={
    ctokenAddr:  '0x53c8882b2ce3fe05b871392faacf32ec051dffec',
    ctokenUnderlyingtoken:  '0x52A9CEA01c4CBDd669883e41758B8eB8e8E2B34b',
    borrower:  '0x281d9a1af0735ecc8e71e9743e1fa5eca0523a08',
    amount:  3216,
    _cWanCollateral:  '0x48c42529c4c8e3d10060e04240e9ec6cd0eb1218'
}


const f = async ()=>{
    let liquid = await comptroller.getHypotheticalAccountLiquidity(RedLiquidScAddr, '0x53c8882b2ce3fe05b871392faacf32ec051dffec', BigNumber.from('0'), BigNumber.from('3216'));
    console.log('liquid: ', liquid);
    console.log(liquid[0].toString());
    console.log(liquid[1].toString());
    console.log(liquid[2].toString());

    let ret = await comptroller.checkMembership(RedLiquidScAddr, CToken_w2wanUSDC_ScAddr);
    console.log('ret:', ret);
}
f();