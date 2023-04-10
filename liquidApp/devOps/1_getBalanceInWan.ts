import config from '../config';
import { ethers } from 'ethers';
let provider = new ethers.providers.JsonRpcProvider(config.wanChain.nodeUrl);

import admin from '../wallet';

const  RedLiquidScAddr = config.RedControllerScAddr;

import { ctokenMap } from '../CTokens';
import underlyingTokenMap from '../underlyingTokens';

import redLiquidObj from '../RedLiquidObj/RedLiquidObj';
const CWanScAddr = config.ctokenName2Addr.w2WAN;

const ctoken_wanUSDC = config.ctokenName2Addr.w2wanUSDC;
const ctoken_wanUSDT = config.ctokenName2Addr.w2wanUSDT;

const underlyingToken_wanUsdc = config.underlyingTokenName2Addr.USDC;
const underlyingToken_wanusdt = config.underlyingTokenName2Addr.USDT;

const standUint18 = ethers.utils.parseUnits('1',18);

const adminMarektBalance = async ()=> {
    console.log('addmin: market')
    for (let [ctokenAddr, scInst] of ctokenMap) {
        let adminCtokenBalance = await scInst.balanceOf(admin.address);
        let exchange = await scInst.exchangeRateStored()
        let ctokenUnderlyingTokenBalance = adminCtokenBalance.mul(exchange).div(standUint18);
        let decimal = 18;
        let underlyingTokenObj = scInst.underlyingTokenObj;
        if (underlyingTokenObj) {
            decimal = underlyingTokenObj.localDecimal
        }
        console.log('Market: ', scInst.localName, "ctokenUnderlyingTokenBalance: ", ethers.utils.formatUnits(ctokenUnderlyingTokenBalance, decimal))

    }
}
const RedLiquidMarketBalance = async ()=>{
    console.log('RedLiquidSc: market')
    for(let [ctokenAddr, scInst ] of ctokenMap){
        let adminCtokenBalance = await scInst.balanceOf(RedLiquidScAddr);
        let exchange = await scInst.exchangeRateStored()
        let ctokenUnderlyingTokenBalance = adminCtokenBalance.mul(exchange).div(standUint18);
        let decimal = 18;
        let underlyingTokenObj = scInst.underlyingTokenObj;
        if(underlyingTokenObj){
            decimal = underlyingTokenObj.localDecimal
        }
        console.log('Market: ', scInst.localName, "ctokenUnderlyingTokenBalance: ", ethers.utils.formatUnits(ctokenUnderlyingTokenBalance, decimal))

    }
}
const adminUnderlyingTokenBalance = async ()=>{
    for(let [address, underlyingToken] of underlyingTokenMap) {
        let b = await underlyingToken.balanceOf(admin.address)
        let decimal = underlyingToken.localDecimal;
        console.log('Admin -- underlyingToken: ', underlyingToken.localName, ' balance: ', ethers.utils.formatUnits(b, decimal));
    }

}
const RedControllerUnderlyingTokenBalance = async ()=>{
    for(let [address, underlyingToken] of underlyingTokenMap) {
        let b = await redLiquidObj.IERC20Balance(address);
        let decimal = underlyingToken.localDecimal;
        console.log('redLiquid -- underlyingToken: ', underlyingToken.localName, ' balance: ', ethers.utils.formatUnits(b, decimal));
    }
}

const main = async ()=>{
    console.log('RedLiquidScAddr: ', RedLiquidScAddr);
    let adminBalance = await provider.getBalance(admin.address);
    console.log('admin balance in Wan :', ethers.utils.formatEther(adminBalance));

    let redLiquidBalance = await provider.getBalance(RedLiquidScAddr);
    console.log('redLiquid Balance  in Wan :', ethers.utils.formatEther(redLiquidBalance));

    let newBalanceOfCWAN = await redLiquidObj.balanceOfCWan(CWanScAddr);
    console.log('redLiquidObj balane of CWAN :', newBalanceOfCWAN.toString());


    await RedLiquidMarketBalance();
    await adminUnderlyingTokenBalance();
    await RedControllerUnderlyingTokenBalance();



}
main()