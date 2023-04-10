import { ethers, BigNumber } from 'ethers';



import config from '../config/index'
import {logger} from '../common/logger';
const abi = config.abi.cErc20Abi;


const nodeUrl = config.wanChain.nodeUrl;


class CErc20 {
    private provider: ethers.providers.JsonRpcProvider;
    private scInst: ethers.Contract;
    public scAddr: string;
    public localName:string;
    public underlyingTokenObj:any;
    constructor(scAddr:string,name:string){
        this.provider = new ethers.providers.JsonRpcProvider(nodeUrl);
        this.scInst = new ethers.Contract(scAddr,abi,this.provider);
        this.scAddr = scAddr;
        this.localName = name;
    }
    setUnderlyingTokenObj(underlyingTokenObj:any){
        this.underlyingTokenObj = underlyingTokenObj;
    }
       //add

    async exchangeRateStored():Promise<BigNumber> {
        let eRate  = await this.scInst.exchangeRateStored();
        return eRate;
    }


    async redeem(wallet:ethers.Wallet, redeemAmount:BigNumber){
        try{
            let singer = wallet.connect(this.provider);
            let signScInst = this.scInst.connect(singer);



            let tx = await signScInst.redeem(redeemAmount,{
                gasLimit:50000000
            });

            let ret = await tx.wait();

            logger.info('ret: ', ret);
            if(ret.status === 1 || ret.status === '1'){
                return true;
            }
        }catch (e) {
            logger.error('e: ', e);
            return false;
        }
    }

    async balanceOf(address:string){
        let bnBalance  = await this.scInst.balanceOf(address);
        return bnBalance;
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


export  default CErc20;