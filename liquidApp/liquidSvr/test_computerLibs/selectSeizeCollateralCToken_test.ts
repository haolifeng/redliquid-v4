import {selectSeizeCollateralCToken} from "../computerLib";
import CTokenData from "../CTokenData";

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


let dataArray = [wan_CTokenData, wasp_CTokenData,usdt_CTokenData]

const wan= async ()=>{
    let {indexTemp,
        bnMostActualRepayAmountTemp } = await selectSeizeCollateralCToken(dataArray, wan_CTokenData)
    console.log('indexTemp: ', indexTemp)
    console.log('bnMostActualRepayAmountTemp', bnMostActualRepayAmountTemp.toString())

}
const usdt = async ()=>{
    let {indexTemp,
        bnMostActualRepayAmountTemp } = await selectSeizeCollateralCToken(dataArray, usdt_CTokenData)
    console.log('indexTemp: ', indexTemp)
    console.log('bnMostActualRepayAmountTemp', bnMostActualRepayAmountTemp.toString())
}
const wasp = async ()=>{
    let {indexTemp,
        bnMostActualRepayAmountTemp } =  await selectSeizeCollateralCToken(dataArray, wasp_CTokenData)
    console.log('indexTemp: ', indexTemp)
    console.log('bnMostActualRepayAmountTemp', bnMostActualRepayAmountTemp.toString())
}
const t = async ()=>{
   //await wan();
   // console.log("=======================================wan============================================")
    await usdt();
  //  console.log("=======================================usdt ============================================")
  //  await wasp();
  //  console.log("=======================================wasp ============================================")
}
t()