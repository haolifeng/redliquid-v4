import { ethers,BigNumber } from 'ethers'
import config from '../config';

import redControllerNoImplObj from "../RedController/RedControllerNoImplObj";
import admin from "../wallet";
let redLiquidScAddr = config.RedLiquidScAddr;

const f = async ()=>{
    let ret = await redControllerNoImplObj.setImple(admin,redLiquidScAddr);
    console.log('ret: ', ret);


}
f();