import axios from "axios";

import AccountData from "./AccountData";
import config from '../config';
import {logger} from '../common/logger';
import {txMap,idleSleep, txStateMap} from "../common/libs";
import { add } from "winston";

class FindLiquidAccountSvr {
    queryUrl:string;
    constructor(queryUrl:string){
        this.queryUrl = queryUrl;
    }
    isNewAccount(account: any){
        if(!txMap.has(account.address)){
            return true;
        }else{
            let oldAccount = txMap.get(account.address);
            if(oldAccount.health !== account.address){
                return true;
            }else{
                return false;
            }

        }

    }
    
    async run(){
      
        try{
            let respond = await axios.get(this.queryUrl);
            if (respond && respond.data) {
            const accounts = respond.data.accounts;
            let findedAccountsArray = [];
            for (let account of accounts) {

                findedAccountsArray.push(account.address);

               // logger.debug('address: ', account.address , 'health: ', account.health, 'total_borrow_value: ',  account.total_borrow_value, 'total_collateral_value: ',account.total_collateral_value)
               let oldAccount = txMap.get(account.address);
               if(oldAccount && oldAccount.health === account.health){
                   continue;
               }else{

                    if(account.address !== '0x64bcc6eafb1b9724206dcc2aa0194a619af6a67a'){
                        // continue;
                    }
  
                    let floatHealth = parseFloat(account.health);
                    if(floatHealth > 10){
                            continue;
                    }
                    let floatTotal_borrow_value = parseFloat(account.total_borrow_value);
                    if(floatTotal_borrow_value <1){
                        logger.debug('accountAddr: ', account.address , 'Total_borrow_value: ', floatTotal_borrow_value);
                                    continue;
                    }
  
                    let accountData = new AccountData(account.address, account.health, account.net_asset_value, account.total_borrow_value, account.total_collateral_value);
                    
                    accountData.addToken(account.tokens);
                    if(accountData.supplyTokens.length === 0 || accountData.borrowTokens.length === 0){
                        logger.debug('accountAddr: ', account.address , 
                        'accountData.supplyTokens.length: ', accountData.supplyTokens.length, 
                         'accountData.borrowTokens.length: ',accountData.borrowTokens.length);
                      
                        continue;
                    }else{

                        txMap.set(account.address, accountData);
                    
                    }
  
               }
            }
            let txKeys = txMap.keys();
            for(let address of txKeys){
                if(findedAccountsArray.includes(address)){

                }else{
                    txMap.delete(address);
                }
            }
            let txStateKeys = txStateMap.keys();
            for(let address of txStateKeys){
                if(findedAccountsArray.includes(address)){

                }else{
                    txStateMap.delete(address);
                }
            }

        

        }
        }catch(e){
            logger.error('e: ', e);
        }
    
    }
}
let findLiquidAccountSvr = new FindLiquidAccountSvr(config.lendApi);
export default findLiquidAccountSvr;

