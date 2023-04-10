import {
    syncAllMarketExchangeRateStored,
    syncCloseFactor,
    syncLiquidationIncentive,
    syncMarketUnderlyTokenPrice,
    updateProcessTimestamp,
    syncUserWanBalance,
    syncUnderlyTokenBalance,
    syncCTokenBalance,
    syncMarketCollatorFactor,
    syncBorrowCaps
} from './syncChainData'

import { idleSleep } from './common/libs';
import {dataLogger} from './common/logger';

const dataApp = async (time:number)=>{
    while(1){
        try{
            await syncAllMarketExchangeRateStored();
            await syncCloseFactor();
            await syncLiquidationIncentive();
            await syncMarketUnderlyTokenPrice();
            await syncCTokenBalance();
            await syncUserWanBalance();
            await syncUnderlyTokenBalance();
            await updateProcessTimestamp('dataApp');

            await syncMarketCollatorFactor();
            await syncBorrowCaps();

            dataLogger.info('============= data async =================');
        }catch(e){
            dataLogger.error('e: ',e);
        }

    await idleSleep(time);
    }

}

export default dataApp;
