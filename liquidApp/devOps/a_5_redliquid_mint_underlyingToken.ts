import config from '../config';
import { BigNumber, ethers } from 'ethers';


import admin from '../wallet';

const  RedLiquidScAddr = config.RedControllerScAddr;
import redLiquidObj from '../RedLiquidObj/RedLiquidObj';
import underlyingTokenMap from "../underlyingTokens";
import {ctokenMap} from "../CTokens";
let provider = new ethers.providers.JsonRpcProvider(config.wanChain.nodeUrl);
const f = async ()=>{
    console.log('RedLiquidScAddr: ', RedLiquidScAddr);
    let adminBalance = await provider.getBalance(admin.address);
    console.log('admin balance in Wan :', ethers.utils.formatEther(adminBalance));

    let redLiquidBalance = await provider.getBalance(RedLiquidScAddr);
    console.log('redLiquid Balance  in Wan :', ethers.utils.formatEther(redLiquidBalance));

    for(let [ctokenAddr, ctokenInst] of ctokenMap) {
        let underlyingTokenInst = ctokenInst.underlyingTokenObj;
        if(underlyingTokenInst){
            let underlyingTokenAddr = underlyingTokenInst.scAddr;
            let b = await redLiquidObj.IERC20Balance(underlyingTokenAddr);

            let decimal = underlyingTokenInst.localDecimal;
            console.log('redLiquid -- underlyingToken: ', underlyingTokenInst.localName, ' balance: ', ethers.utils.formatUnits(b, decimal));
            if(b.eq(BigNumber.from('0'))|| b.eq(BigNumber.from('1'))){

            }else{
                await redLiquidObj.mintCToken(admin,ctokenAddr,b);

            }
        }
    }

}

f();