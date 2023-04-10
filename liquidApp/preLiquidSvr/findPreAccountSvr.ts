import axios from "axios";


import config from '../config';
import {preLogger} from '../common/logger';

import { comptroller } from '../CTokens';

import { computerOnChainAddressLiquidAmount } from './onChainDataComputer';
import redLiquidObj from "../RedLiquidObj/RedLiquidObj";
import admin from "../wallet";
class FindPreAccountSvr {
    queryUrl:string;
    constructor(queryUrl:string){
        this.queryUrl = queryUrl;
    }
    async checkAndLiquidAccount(accountAddr:string){
        let {
            borrowCTokenAddr, borrowCTokenName, borrowCTokenUnderylingTokenAddr,borrowCtokenUnderlyingTokenName, supplyCTokenAddr,supplyCTokenName ,supplyCTokenAddrUnderlyingTokenAddr,supplyCTokenUnderlyingTokenName, liquidAmount
        } = await computerOnChainAddressLiquidAmount(accountAddr);

        if(borrowCTokenName === 'w2WAND' || borrowCTokenName === 'w2ZOO'){
            continue;
        }
        if(borrowCTokenName !== 'w2WAN' && supplyCTokenName !== 'w2WAN'){
            let headUnderlyingTokenName = supplyCTokenUnderlyingTokenName;
            let endUnderlyingTokenName = borrowCtokenUnderlyingTokenName;
            let path = config.paths[headUnderlyingTokenName + '2' + endUnderlyingTokenName];
            preLogger.info('path: ', path);
            let ret = await redLiquidObj.liquidFnSwapExactTokensForTokens(admin,borrowCTokenAddr,
                borrowCTokenUnderylingTokenAddr,
                accountAddr,liquidAmount,supplyCTokenAddr,supplyCTokenAddrUnderlyingTokenAddr,path
            )

            preLogger.info('2-END-LIQUID, ret: ', ret);

        }else if(borrowCTokenName == 'w2WAN' && supplyCTokenName !== 'w2WAN'){
            let headUnderlyingTokenName = supplyCTokenUnderlyingTokenName;
            let endUnderlyingTokenName = borrowCtokenUnderlyingTokenName;
            let path = config.paths[headUnderlyingTokenName + '2' + endUnderlyingTokenName];
            preLogger.info(headUnderlyingTokenName + '2' + endUnderlyingTokenName);
            preLogger.info(path);

            let ret = await redLiquidObj.liquidFnSwapExactTokensForETH(admin,
                borrowCTokenAddr,
                accountAddr,
                liquidAmount,
                supplyCTokenAddr,
                supplyCTokenAddrUnderlyingTokenAddr,
                path);
            preLogger.info("1-END-LIQUID, ret", ret);

        }else if(borrowCTokenName !== 'w2WAN' && supplyCTokenName == 'w2WAN'){
            let headUnderlyingTokenName = supplyCTokenUnderlyingTokenName;
            let endUnderlyingTokenName = borrowCtokenUnderlyingTokenName;
            let path = config.paths[headUnderlyingTokenName + '2' + endUnderlyingTokenName];
            preLogger.info(headUnderlyingTokenName + '2' + endUnderlyingTokenName);
            preLogger.info(path);

            let ret = await redLiquidObj.liquidFnSwapExactETHForTokens(admin,
                borrowCTokenAddr,
                borrowCTokenUnderylingTokenAddr,
                accountAddr,
                liquidAmount,
                supplyCTokenAddr,
                path);

            preLogger.info("0-END-LIQUID, ret", ret);
        }
    }
    async run(){
        try {
            let respond = await axios.get(this.queryUrl);
            if(respond && respond.data){
                const accounts = respond.data.accounts;

                let batchPromises = [];

                for (let account of accounts) {
                    let floatHealth = parseFloat(account.health);
                    let accountAddr = account.address;

                    if (floatHealth < 1) {
                        preLogger.info('account: ', accountAddr, 'health: ', floatHealth);

                        let ret = await comptroller.getAccountLiquidity(accountAddr);
                        preLogger.debug('ret[0]: ', ret[0].toString());
                        preLogger.debug('ret[1]: ', ret[1].toString());
                        preLogger.debug('ret[2]: ', ret[2].toString());

                        if(ret && ret[2]){
                            if(ret[2].toString() !== '0'){

                                batchPromises.push(this.checkAndLiquidAccount(accountAddr));

                            }
                        }
                    }

                }
                await Promise.all(batchPromises);

            }
        }catch(err){
            preLogger.error(err);
        }

    }
}

let findPreAccountSvr = new FindPreAccountSvr(config.lendApiPre);

export default  findPreAccountSvr;