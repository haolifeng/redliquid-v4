import {computeBorrowAmountFromCollateWan} from "../computerLib";
import CTokenData from "../CTokenData";


const data_usdt = {
    cTokenAddress:'0x86d6aa06b2649a68b59cd76e0195dbd26c5c6c48',
    underlyTokenAmount:'1.000001'
}
let usdt_CTokenData = new CTokenData(data_usdt.cTokenAddress, data_usdt.underlyTokenAmount)
const t = async ()=>{
    let bnMostActualRepayAmount = await computeBorrowAmountFromCollateWan(usdt_CTokenData)
    console.log('bnMostActualRepayAmount: ', bnMostActualRepayAmount.toString());
}

t();