import {
    mostValueMarket,
    selectSeizeCollateralCToken,
    computeBorrowAmountFromCollateWan,
    computerActualRepayAmountFloatFromUnderlyAmount
} from './computerLib';
import admin from '../wallet'

import config from '../config';
import {BigNumber, ethers } from 'ethers';

async function test_computerBorrowAmountFromColaterWan() {
    let bnBorrowAccount = await computeBorrowAmountFromCollateWan(config.ctokenName2Addr.w2WAN);
    console.log('bnBorrowAccount: ', ethers.utils.formatEther(bnBorrowAccount));
}
async function test_computerActualRepayAmountFloatFromUnderlyAmount(){
    let bnBalance = await computerActualRepayAmountFloatFromUnderlyAmount(ethers.utils.parseEther('100'),config.ctokenName2Addr.w2WAN, config.ctokenName2Addr.w2WAN);
    console.log('bnBalance: ', ethers.utils.formatEther(bnBalance));
}
//test_computerBorrowAmountFromColaterWan();
test_computerActualRepayAmountFloatFromUnderlyAmount();