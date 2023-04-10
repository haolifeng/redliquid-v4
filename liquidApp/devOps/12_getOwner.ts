import config from '../config';
import { BigNumber, ethers } from 'ethers';
let provider = new ethers.providers.JsonRpcProvider(config.wanChain.nodeUrl);

import admin from '../wallet';
const  RedLiquidScAddr = config.RedLiquidScAddr;

import redLiquidObj from '../RedLiquidObj/RedLiquidObj';

const run = async ()=>{
    let owner = await redLiquidObj.owner();
    console.log('owner: ', owner);
}

run();
