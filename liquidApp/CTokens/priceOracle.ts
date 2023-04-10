import { ethers } from 'ethers';
import config from '../config/index';

const scAddr = config.config_mainnet.PriceOracleProxy;
const nodeUrl = config.wanChain.nodeUrl;
const abi = config.abi.PriceOracleProxy;
class PriceOracle {
    private provider:ethers.providers.JsonRpcProvider;
    private scInst:ethers.Contract;
    constructor(){
        this.provider = new ethers.providers.JsonRpcProvider(nodeUrl);
        this.scInst = new ethers.Contract(scAddr,abi, this.provider);
    }
    async getUnderlyingPrice(ctokenAddr:string){
        let price = await this.scInst.getUnderlyingPrice(ctokenAddr);
        return price;
    }

}

let priceOracle = new PriceOracle();

export default priceOracle;