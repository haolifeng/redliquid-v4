import { ethers, BigNumber } from 'ethers';

import config from "../config";
import {logger} from "../common/logger";
const abi = config.abi.cWanAbi;
const scAddr = config.ctokenName2Addr.w2WAN;
const nodeUrl = config.wanChain.nodeUrl;

class CWan {
    private provider: ethers.providers.JsonRpcProvider;
    private scInst: ethers.Contract;
    public scAddr :string;
    public localName:string;
    public underlyingTokenObj:any;
    constructor(){
        this.provider = new ethers.providers.JsonRpcProvider(nodeUrl);
        this.scInst = new ethers.Contract(scAddr,abi,this.provider);
        this.scAddr = scAddr;
        this.localName = 'w2WAN';
        this.underlyingTokenObj=null;
    }
    async liquidateBorrow(wallet:ethers.Wallet, borrower:string,  cTokenCollateral:string,value:BigNumber): Promise<boolean>{
        logger.info('cwan.liquidateBorrow: ','liquidor: ', wallet.address, 'borrower: ', borrower, 'ctokenCollateral: ', cTokenCollateral, 'value: ', value.toString());

        try{
            let singer = wallet.connect(this.provider);
            let signScInst = this.scInst.connect(singer);

            let tx = await signScInst.liquidateBorrow(borrower, cTokenCollateral,{
                value:value,
                gasLimit:50000000
            });

            let ret = await tx.wait();

            logger.info('ret: ', ret);
            if(ret.status === 1 || ret.status === '1'){
                return true;
            }
        }catch (e) {
            logger.info('e: ', e);
            return false;
        }


    }
    async exchangeRateStored():Promise<BigNumber> {
        let eRate  = await this.scInst.exchangeRateStored();
        return eRate;
    }
    async balanceOf(address:string){
        let bnBalance  = await this.scInst.balanceOf(address);
        return bnBalance;
    }
    async redeem(wallet:ethers.Wallet, amount:BigNumber){
        try{
            logger.info('cwan.redeem ', 'wallet: ', wallet.address, 'amount: ', amount.toString());
            let singer = wallet.connect(this.provider);
            let signScInst = this.scInst.connect(singer);

            let tx = await signScInst.redeem(amount,{
                gasLimit:50000000
            });

            let ret = await tx.wait();

            logger.info('ret: ', ret);

            if(ret.status === 1 || ret.status === '1'){
                return true;
            }
        }catch (e) {
            logger.info('e: ', e);
            return false;
        }
    }
    async borrowBalanceStored(address:string){
        let borrowBalance = await this.scInst.borrowBalanceStored(address);
        return borrowBalance;
    }
    async getAccountSnapshot(userAddr:string){
        let ret = await this.scInst.getAccountSnapshot(userAddr);
        return ret;
    }

}

let cwan = new CWan();
export default cwan;