import config from '../config';
import { BigNumber, ethers } from 'ethers';
let provider = new ethers.providers.JsonRpcProvider(config.wanChain.nodeUrl);

import admin from '../wallet';


import redLiquidObj from '../RedLiquidObj/RedLiquidObj';

import {ctokenMap} from '../CTokens';

const CWanScAddr = config.ctokenName2Addr.w2WAN;

async function f(){
    let oldbalanceOfWan = await redLiquidObj.balanceOfWan();
    console.log('1. oldbalanceOfWan wan : ', ethers.utils.formatEther(oldbalanceOfWan));


    let balanceOfCWan = await redLiquidObj.balanceOfCWan(CWanScAddr);
    console.log('old balance of CWAN: ', balanceOfCWan.toString());

    await redLiquidObj.redeemWan(admin,CWanScAddr,balanceOfCWan);



    let balanceOfWan = await redLiquidObj.balanceOfWan();
    console.log('middle blanceOf wan : ', ethers.utils.formatEther(balanceOfWan));


    await redLiquidObj.sendWan(admin,admin.address, balanceOfWan.sub(BigNumber.from('1')));


    

    let newBalanceOfWan = await redLiquidObj.balanceOfWan();

    console.log('new balance Of Wan: ', ethers.utils.formatEther(newBalanceOfWan));

    let newBalanceOfCWAN = await redLiquidObj.balanceOfCWan(CWanScAddr);
    console.log('balane of CWAN :', newBalanceOfCWAN.toString());


}

f();