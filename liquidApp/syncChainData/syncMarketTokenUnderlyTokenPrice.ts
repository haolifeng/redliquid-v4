import config from '../config';
import {ctokenMap,priceOracle} from "../CTokens";
import storage from '../db';
import {dataLogger} from '../common/logger';



async function syncMarketUnderlyTokenPrice(){
    for(let [ ctokenAddr, scInt] of ctokenMap){


        try{
            dataLogger.debug('ctokenAddr:  --- 0', ctokenAddr);
            let price = await priceOracle.getUnderlyingPrice(ctokenAddr);

            dataLogger.debug('price: ---1: ', price);

            let ctokenName = scInt.localName;

            let ierc20 = scInt.underlyingTokenObj;
            let tempDecimal = 18;
            if(ierc20){
                let decimal = ierc20.localDecimal;
                if(decimal< tempDecimal){
                    tempDecimal = tempDecimal + tempDecimal - decimal;
                }
                dataLogger.debug('tempDecimal  -- 2: ', tempDecimal);

            }
            await storage.updateCTokenUnderlyingPrice(ctokenName, ctokenAddr, price, tempDecimal)
        }catch (e) {
            dataLogger.error('syncMarketUnderlyTokenPrice, ctokenName: ', scInt.localName, 'e: ',e);
        }





    }
}

export default  syncMarketUnderlyTokenPrice;
