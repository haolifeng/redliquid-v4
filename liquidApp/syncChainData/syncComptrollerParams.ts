
import {dataLogger} from '../common/logger';
import {comptroller} from '../CTokens';
import storage from '../db';
import {ctokenMap} from '../CTokens';
const syncLogger = dataLogger;

async function syncCloseFactor(){
    try{
        let closeF = await comptroller.closeFactor();
        let strClosef = closeF.toString();
        await storage.updateCloseFactor(strClosef);
    }catch (e) {
        syncLogger.error('syncCloseFactor: e', e);
    }

}

async function syncLiquidationIncentive(){
    try{
        let liquidIncent = await comptroller.liquidationIncentive();
        syncLogger.debug('liquidIncent: ', liquidIncent.toString());
        let strLiquidIncent = liquidIncent.toString();

        await storage.updateLiquidationIncentive(strLiquidIncent);
    }catch (e) {
        syncLogger.error('syncLiquidationIncentive: e', e);
    }


}
async function syncMarketCollatorFactor(){
    try{
        for(let [ctokenAddr,  ctokenInst] of ctokenMap){
            let market = await comptroller.markets(ctokenAddr);
            syncLogger.debug('===============================================================')
            syncLogger.debug('ctokenName: ',ctokenInst.localName);

            syncLogger.debug('market.isListed: ', market.isListed);
            syncLogger.debug('market.collateralFactorMantissa: ', market.collateralFactorMantissa.toString());
            syncLogger.debug('market.isComped: ', market.isComped);

            await storage.updateMarketsEnv(ctokenInst.localName, ctokenAddr,  market.isListed, market.collateralFactorMantissa.toString(),market.isComped);


        }

    }catch (e) {
        syncLogger.error('syncLiquidationIncentive: e', e);
    }
}
async function syncBorrowCaps(){
    try{
        for(let [ctokenAddr,  ctokenInst] of ctokenMap){
            let borrowCaps = await comptroller.borrowCaps(ctokenAddr);
            syncLogger.debug('===============================================================')
            syncLogger.debug('ctokenName: ',ctokenInst.localName);

            syncLogger.debug('market.borrowCaps: ', borrowCaps);



        }

    }catch (e) {
        syncLogger.error('syncLiquidationIncentive: e', e);
    }
}

export {
    syncCloseFactor,syncLiquidationIncentive,syncMarketCollatorFactor,syncBorrowCaps
}