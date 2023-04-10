import config from '../config';
import { BigNumber, ethers } from 'ethers';


import admin from '../wallet';


import redLiquidObj from '../RedLiquidObj/RedLiquidObj';



const CWanScAddr = config.ctokenName2Addr.w2WAN;

async function f(){
    let balanceOfWan = await redLiquidObj.balanceOfWan();
    console.log('blanceOf wan : ', ethers.utils.formatEther(balanceOfWan));
    let mintWanAmount:BigNumber = balanceOfWan.sub(BigNumber.from('1'));
    await redLiquidObj.mintWan(admin,CWanScAddr,mintWanAmount);

    let newBalanceOfWan = await redLiquidObj.balanceOfWan();

    console.log('new balance Of Wan: ', ethers.utils.formatEther(newBalanceOfWan));

    let newBalanceOfCWAN = await redLiquidObj.balanceOfCWan(CWanScAddr);
    console.log('balane of CWAN :', newBalanceOfCWAN.toString());


}

f();