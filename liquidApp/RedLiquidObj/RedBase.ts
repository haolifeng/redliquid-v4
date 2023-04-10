import {BigNumber, ethers} from "ethers";

import {logger } from '../common/logger';
class RedBase {
    scAddr:string;
    scInst:ethers.Contract;
    provider:ethers.providers.JsonRpcProvider;
    constructor(scAddr, nodeUrl, abi){
        this.scAddr = scAddr;
        this.provider = new ethers.providers.JsonRpcProvider(nodeUrl);
        this.scInst = new ethers.Contract(this.scAddr, abi, this.provider);
    }
    async owner(){
        let owner = await this.scInst.owner();
        return owner;
    }
    async balanceOfWan(){
        let wanBalance = await this.provider.getBalance(this.scAddr);
        return wanBalance;
    }
    async sendWan(wallet:ethers.Wallet, to:string, amount:BigNumber){
        let singer = wallet.connect(this.provider);
        let signedWallet = this.scInst.connect(singer);
        let tx = await signedWallet.sendWan(to,amount);
        let ret = await tx.wait();
        logger.info('ret: ', ret);
    }
    async approve(wallet:ethers.Wallet,sender:string, amount:BigNumber){

    }


}

export default RedBase;