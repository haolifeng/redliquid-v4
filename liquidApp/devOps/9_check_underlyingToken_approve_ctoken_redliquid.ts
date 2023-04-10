import config from '../config';
import {ethers} from "ethers";

let redLiquidScAddr = config.RedLiquidScAddr;

let provider = new ethers.providers.JsonRpcProvider(config.wanChain.nodeUrl);

let w2wanUSDC_CToken_ScAddr = config.ctokenName2Addr.w2wanUSDC;
let wanUSDC_scAddr = config.underlyingTokenName2Addr.USDC;

let abi = config.abi.erc20Abi;

let underlyingToken_wanUSDC = new ethers.Contract(wanUSDC_scAddr,abi,provider);

const run = async ()=>{
    let balance = await underlyingToken_wanUSDC.allowance(redLiquidScAddr,w2wanUSDC_CToken_ScAddr);
    console.log('balance: ', balance.toString());
}

run();