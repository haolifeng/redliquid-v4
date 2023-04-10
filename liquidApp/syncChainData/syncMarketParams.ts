
import storage from "../db";
import { ctokenMap } from '../CTokens';

import {dataLogger} from "../common/logger";
let logger = dataLogger;
async function syncAllMarketExchangeRateStored() {
    for(let [ctokenAddr, scInst ] of ctokenMap){
        try{
            let exchangeRate = await scInst.exchangeRateStored();
            let ctokenName = scInst.localName;
            logger.debug('ctokenName: ', ctokenName);
            logger.debug('ctokenAddr: ', ctokenAddr);
            logger.debug('excchangeRate: ',exchangeRate.toString());
            await storage.updateExchangeRate(ctokenName,ctokenAddr, exchangeRate.toString());
        }catch (e) {
            logger.error('syncAllMarketExchangeRateStored, ctokenName: ', scInst.localName, 'e: ',e);
        }

    }
}

async function updateProcessTimestamp(appType:string){
    let time = new Date().getTime();

    await storage.updateHeartBeat(appType, time)

}


export {
    syncAllMarketExchangeRateStored,
    updateProcessTimestamp

}