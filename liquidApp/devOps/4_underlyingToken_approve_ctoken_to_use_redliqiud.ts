import config from '../config';
import { BigNumber, ethers } from 'ethers';


import admin from '../wallet';


import redLiquidObj from '../RedLiquidObj/RedLiquidObj';

import {ctokenMap} from '../CTokens';

const routerScAddr = config.SwapRouterScAddr;

const redLiquidScAddr = config.RedControllerScAddr;

const underlyingApprove_router_ctoken = async ()=>{
    for(let [ctokenAddr, ctokenInst] of ctokenMap){
        //console.log('ctokenAddr ', ctokenAddr);
        let underlyToken = ctokenInst.underlyingTokenObj;
        if(underlyToken){
            let underlyTokenScAddr = underlyToken.scAddr;
            console.log('ctokenAddr: ', ctokenAddr, 'underlyTokenAddr: ', underlyTokenScAddr);
            let rt = await redLiquidObj.IERC20Approve(admin,underlyTokenScAddr,ctokenAddr,BigNumber.from('115792089237316195423570985008687907853269984665640564039457584007913129639935'));
            console.log('ret: ',rt);
        }
    }
}

const underlyingApprove_router = async ()=>{
    for(let [ctokenAddr, ctokenInst] of ctokenMap){
        //console.log('ctokenAddr ', ctokenAddr);
        let underlyToken = ctokenInst.underlyingTokenObj;
        if(underlyToken){
            let underlyTokenScAddr = underlyToken.scAddr;
            console.log( underlyToken.localName, ': underlyTokenAddr: ', underlyTokenScAddr, ' -> router: ', routerScAddr);


            let allowanceBalance = await underlyToken.allowance(redLiquidScAddr, routerScAddr);
            if(allowanceBalance.eq(BigNumber.from(0))){
                let rt = await redLiquidObj.IERC20Approve(admin,underlyTokenScAddr,routerScAddr,BigNumber.from('115792089237316195423570985008687907853269984665640564039457584007913129639935'));
                console.log('underlyingApprove_router_ctoken -- underlyingApprove_router-- ret: ',rt);
            }else{
                console.log('allowanceBalance: ', allowanceBalance.toString());
            }


        }
    }
}
(async function(){
    //await underlyingApprove_router_ctoken();
    await underlyingApprove_router();
})();