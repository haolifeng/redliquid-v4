
import {ethers} from "ethers";


import config from '../config';
const nodeUrl = config.wanChain.nodeUrl;
const provider = new ethers.providers.JsonRpcProvider(nodeUrl);

import storage from '../db';


import admin from '../wallet';
import {dataLogger} from '../common/logger';

let userArray = [admin.address, config.RedControllerScAddr];

async function syncUserWanBalance(){
    
        try{
            for(let address of userArray){
                let wanBalance = await provider.getBalance(address);
                await storage.updateUserBalance(address, wanBalance.toString());
            }


        }catch (e) {
            dataLogger.error('e: ', e);
        }

    
}

export default  syncUserWanBalance;