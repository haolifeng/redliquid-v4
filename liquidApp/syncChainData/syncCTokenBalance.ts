import storage from "../db";

import { ctokenMap} from "../CTokens";


import admin from "../wallet";
import {dataLogger} from "../common/logger";

import config from '../config';
const RedLiquidScAddr = config.RedControllerScAddr;


let addressArray = [admin.address, RedLiquidScAddr];
let logger = dataLogger;

async function syncCTokenBalance(){
    // @ts-ignore
    for(let [ctokenAddr, ctoken] of ctokenMap){

                try{
                    for(let address of addressArray){
                        let ctokenBalance = await ctoken.balanceOf(address);

                        logger.debug('ctoken: ', ctoken.localName, 'balance: ', ctokenBalance.toString());
                        await storage.updateCTokenBalance(ctoken.localName,ctokenAddr, address, ctokenBalance.toString());
                    }
                 
                }catch (e) {
                    logger.error('cotken: ', ctoken.localName, ' e:',e);
                }




    }

}

export default  syncCTokenBalance;