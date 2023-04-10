import config from '../config';
import { BigNumber, ethers } from 'ethers';
let provider = new ethers.providers.JsonRpcProvider(config.wanChain.nodeUrl);

const f = async  ()=>{
    let receit = await provider.getTransactionReceipt('0x8c561c2d91e4389f9463e7923a2ca29cf5a016918cccdac0ba66f5a102e918dc');
    console.log('receipt: ', receit);
}
f();

