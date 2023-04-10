import CErc20 from './cerc20';
import config from '../config/index';

import comptroller from "./comptroller";
import cwan from "./cwan";
import priceOracle from "./priceOracle";

const ctokenName2Addr = config.ctokenName2Addr;

import underlyingTokenMap from '../underlyingTokens';
const config_mainnet = config.config_mainnet;
const params = config_mainnet.params;


let ctokenMap = new Map();

for(let ctokenName in ctokenName2Addr){

    let ctokenAddr = ctokenName2Addr[ctokenName];

    if(ctokenName === 'w2WAN'){
        ctokenMap.set(ctokenAddr, cwan)

    }else{
        let cerc20Inst = new CErc20(ctokenAddr,ctokenName);
        let underlyingTokenAddr = params[ctokenName].underlying;

        let underlyintTokenObj = underlyingTokenMap.get(underlyingTokenAddr.toLowerCase());
        cerc20Inst.setUnderlyingTokenObj(underlyintTokenObj);

        ctokenMap.set(ctokenAddr.toLowerCase(), cerc20Inst);
    }

}

export {
    ctokenMap, comptroller, priceOracle
}
