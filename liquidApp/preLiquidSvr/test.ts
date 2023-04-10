import {computerOnChainAddressLiquidAmount} from "./onChainDataComputer";

const borrower = '0x8E7fbb49f436d0e8a50c02F631e729A57a9a0aCA';

const t = async ()=>{
    let {
        borrowCTokenAddr, borrowCTokenName, borrowCTokenUnderylingTokenAddr, supplyCTokenAddr,supplyCTokenName ,supplyCTokenAddrUnderlyingTokenAddr, liquidAmount
    } = await computerOnChainAddressLiquidAmount(borrower);

    console.log('borrowCTokenAddr: ',borrowCTokenAddr);
    console.log('borrowCTokenName: ',borrowCTokenName);
    console.log('borrowCTokenUnderylingTokenAddr: ',borrowCTokenUnderylingTokenAddr);

    console.log('supplyCTokenAddr: ',supplyCTokenAddr);
    console.log('supplyCTokenName: ',supplyCTokenName);
    console.log('supplyCTokenAddrUnderlyingTokenAddr: ',supplyCTokenAddrUnderlyingTokenAddr);

    console.log('liquidAmount: ',liquidAmount.toString());
}
t();