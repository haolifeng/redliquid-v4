import {computerActualRepayAmountFloatFromUnderlyAmount} from "../computerLib";
import CTokenData from "../CTokenData";
import {BigNumber, ethers} from "ethers";



const data_wan = {
    cTokenAddress:'0x48c42529c4c8e3d10060e04240e9ec6cd0eb1218',
    underlyTokenAmount:'1.000000000000000001'
}
const data_usdt = {
    cTokenAddress:'0x86d6aa06b2649a68b59cd76e0195dbd26c5c6c48',
    underlyTokenAmount:'1.000001'
}
const data_wasp = {
    cTokenAddress:'0x75c47f668077269cce5ab74b7b7becdafe8ac88f',
    underlyTokenAmount:'1.000000000000000001'
}
let wasp_CTokenData = new CTokenData(data_wasp.cTokenAddress, data_wasp.underlyTokenAmount)
let wan_CTokenData = new CTokenData(data_wan.cTokenAddress, data_wan.underlyTokenAmount)
let usdt_CTokenData = new CTokenData(data_usdt.cTokenAddress, data_usdt.underlyTokenAmount)


let dataArray = [wan_CTokenData, wasp_CTokenData, usdt_CTokenData]



const wan2usdt = async ()=>{
    let bnCollateralCtokenUnderlyAmount = ethers.utils.parseUnits(data_wan.underlyTokenAmount,'18');
    let     collateralCTokenAddress = data_wan.cTokenAddress;
    let    collateralDecimal = 18;
    let    liquidMarketsTokenAddr = data_usdt.cTokenAddress;
    let    liquidDecimal = 6;

    let bnAcutalRepayAmount =  await computerActualRepayAmountFloatFromUnderlyAmount(bnCollateralCtokenUnderlyAmount,collateralCTokenAddress,collateralDecimal,liquidMarketsTokenAddr,liquidDecimal);
    console.log('bnActualRepayAmount: ', bnAcutalRepayAmount.toString())
}
const wan2wasp = async() =>{
    let bnCollateralCtokenUnderlyAmount,
        collateralCTokenAddress,
        collateralDecimal,
        liquidMarketsTokenAddr,
        liquidDecimal
}

const usdt2wasp = async ()=>{
    let bnCollateralCtokenUnderlyAmount,
        collateralCTokenAddress,
        collateralDecimal,
        liquidMarketsTokenAddr,
        liquidDecimal
}


const t = async ()=>{
    await wan2usdt();
}
t();

