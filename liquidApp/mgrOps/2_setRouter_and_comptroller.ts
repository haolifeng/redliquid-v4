import { ethers,BigNumber } from 'ethers'
import config from '../config';


import admin from "../wallet";

import redLiquidObj from "../RedLiquidObj/RedLiquidObj";

async  function f() {
    let ret1 = await await redLiquidObj.setComptroller(admin);
    console.log('ret1: ', ret1);
    let ret2 = await redLiquidObj.setRouter(admin);
    console.log('ret2: ', ret2);
}
f();