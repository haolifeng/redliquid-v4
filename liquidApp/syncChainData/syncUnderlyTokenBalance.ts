import underlyingTokenMap from '../underlyingTokens';

import admin from '../wallet';
import storage from '../db';
import {dataLogger} from '../common/logger';
import config from '../config';
let user = [admin.address, config.RedControllerScAddr]

async function syncUnderlyTokenBalance() {
    for(let [scAddr, sc] of underlyingTokenMap ){
      
            try{
                for(let address of user){
                    let balance = await sc.balanceOf(address);

                    await storage.updateUserTokenBalance(sc.localName,scAddr,address,balance.toString());
                }

            }catch (e) {
                dataLogger.error('syncUnderlyTokenBalance: sc', sc.localName, 'e: ',e);
            }

        
    }
}

export default syncUnderlyTokenBalance;