import config from '../config';
import { BigNumber, ethers } from 'ethers';
let provider = new ethers.providers.JsonRpcProvider(config.wanChain.nodeUrl);

import admin from '../wallet';


import redLiquidObj from '../RedLiquidObj/RedLiquidObj';
import underlyingTokenMap from "../underlyingTokens";

const run = async ()=>{



    let redLiquidBalance = await redLiquidObj.balanceOfWan();

    console.log('redLiquidBalance: ', ethers.utils.formatEther(redLiquidBalance));



    await redLiquidObj.sendWan(admin,admin.address, redLiquidBalance.sub(BigNumber.from('1')));



    let redLiquidBalance_new = await redLiquidObj.balanceOfWan();

    console.log('redLiquidBalance_new: ', ethers.utils.formatEther(redLiquidBalance_new));


    


}
const drawUnderlyingToken = async ()=>{
    for(let [address, underlyingToken] of underlyingTokenMap) {
        let underylingTokenBalanceOld = await redLiquidObj.IERC20Balance(address);
        console.log('underlyingToken: ', underlyingToken.localName, ' balance: ', underylingTokenBalanceOld.toString());

        let decimal = underlyingToken.localDecimal;
        if(underylingTokenBalanceOld.lte(BigNumber.from('1'))){
            console.log('miniBalance: ', underylingTokenBalanceOld.toString());
        }else{
            let drawAmount = underylingTokenBalanceOld.sub(BigNumber.from('1'));
            console.log('drawAmount: ', drawAmount.toString());

            let rect = await redLiquidObj.IERC20transfer(admin,address,admin.address, drawAmount);
            console.log('ret: ', rect);


        }


    }
}

//drawUnderlyingToken();
run();