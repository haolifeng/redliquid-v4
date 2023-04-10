import config from '../config';
import { BigNumber, ethers } from 'ethers';
let provider = new ethers.providers.JsonRpcProvider(config.wanChain.nodeUrl);

import admin from '../wallet';

const  RedLiquidScAddr = config.RedControllerScAddr;


import underlyingTokenMap from '../underlyingTokens';

import redLiquidObj from '../RedLiquidObj/RedLiquidObj';

async function name() {
    for(let [address, underlyingToken] of underlyingTokenMap) {
        let b = await redLiquidObj.IERC20Balance(address);
        console.log('underlyingToken: ', underlyingToken.localName, ' balance: ', b.toString());
        if(b.eq(BigNumber.from('0'))|| b.eq(BigNumber.from('1'))){

        }else{
            let ret = await redLiquidObj.IERC20transfer(admin, address,admin.address, b.sub(BigNumber.from('1')));
            console.log('ret.status : ', ret.status);
        }
     }
}
name()