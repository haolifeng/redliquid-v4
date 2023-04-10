import config from '../config';
import {ethers} from "ethers";

const redControllerAbi = config.abi.RedControllerAbi;
const redControllerScAddr = config.RedControllerScAddr;

class RedControllerNoImplObj {
    scAddr:string;
    scAbi:any;
    provider:ethers.providers.JsonRpcProvider;
    scInst:ethers.Contract;
    constructor(){
        this.scAddr = redControllerScAddr;
        this.scAbi = redControllerAbi;
        this.provider = new ethers.providers.JsonRpcProvider(config.wanChain.nodeUrl);
        this.scInst = new ethers.Contract(this.scAddr,this.scAbi,this.provider);
    }
    async setImple(wallet:ethers.Wallet, implScAddr:string){
        let signer = wallet.connect(this.provider);
        let signedSc = this.scInst.connect(signer);
        let tx = await signedSc.setImple(implScAddr);
        let ret = await tx.wait();
        return ret;
    }
}

let redControllerNoImplObj = new RedControllerNoImplObj();
export default redControllerNoImplObj;