import config from '../config';
import {BigNumber, ethers} from 'ethers';
let provider = new ethers.providers.JsonRpcProvider(config.wanChain.nodeUrl);

import admin from '../wallet';


const  RedLiquidScAddr = config.RedControllerScAddr;

const run = async ()=>{

    let adminBalance = await provider.getBalance(admin.address);
    console.log('admin balance in Wan :', ethers.utils.formatEther(adminBalance));

    let sendVale:BigNumber;
    let baseAmount:BigNumber = ethers.utils.parseEther('1');
    if(adminBalance.gt(baseAmount)){
        sendVale = adminBalance.sub(baseAmount);
    }else{
        sendVale =  baseAmount;
    }
   
    let signedWallet = admin.connect(provider);

    const tx = await signedWallet.sendTransaction({
        to: RedLiquidScAddr,
        value:sendVale
    });
    let ret = await tx.wait();
    console.log('ret: ', ret);
    


}
run();