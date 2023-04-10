
import BalanceSchema from "./models/BalanceSchema";
import MarketParamsSchema from "./models/MarketParamsSchema";
import CTokenUnderlyingPriceSchema from "./models/CTokenUnderlyingPriceSchema";
import CTokenExchangeRateSchema from "./models/CTokenExchangeRateSchema";
import HeartBeatSchema from "./models/HeartbeatSchema";
import CTokenBalanceSchema from "./models/CTokenBalanceSchema";
import MarketsEnvSchema from './models/MarketsEnvSchema';
import {logger,dataLogger} from "../common/logger";
import config from '../config';
const dbConfig = config.storage;

class Storage {
    db:any;
    balanceModel:any;
    marketParamModel:any;
    cTokenUnderlyingPriceModel:any;
    cTokenExchangeRateModel:any;
    heartBeatModel:any;
    ctokenBalanceModel:any;
    marketsEnvModel:any;
    logger:any;
    syncLogger:any;
    constructor(chainDb:any){
        this.db = chainDb;

        this.balanceModel = this.db.model(dbConfig.balanceModelName, BalanceSchema);
        this.marketParamModel = this.db.model(dbConfig.marketParamModelName, MarketParamsSchema);
        this.cTokenUnderlyingPriceModel = this.db.model(dbConfig.cTokenUnderlyingPriceModelName,CTokenUnderlyingPriceSchema)
        this.cTokenExchangeRateModel = this.db.model(dbConfig.cTokenExchangeRateModelName,CTokenExchangeRateSchema);
        
        this.heartBeatModel = this.db.model(dbConfig.heartBeatModelName, HeartBeatSchema);

        this.ctokenBalanceModel = this.db.model(dbConfig.cTokenBalanceModelName, CTokenBalanceSchema);
        this.marketsEnvModel = this.db.model(dbConfig.marketsEnvModuleName,MarketsEnvSchema);
        

        this.logger = logger;
        this.syncLogger = dataLogger;
    }
    async updateMarketsEnv(ctokenName:string, ctokenAddr:string,isListed:boolean, collateralFactorMantissa:string, isComped:boolean){
        try{
           
            let oldDocs = await this.marketsEnvModel.find({
                cTokenName:ctokenName,
                cTokenAddr:ctokenAddr
            });
            let oldDoc = oldDocs[0];
            
            if(!oldDoc){
                
                let doc = new this.marketsEnvModel({
                    cTokenName:ctokenName,
                    cTokenAddr:ctokenAddr,
                    isListed:isListed,
                    collateralFactorMantissa:collateralFactorMantissa,
                    isComped:isComped
                });
                let newDoc = await doc.save();
                if(newDoc){
                    this.syncLogger.debug('updateMarketsEnv: ',newDoc);
                }
            }else{
                let ret = await this.heartBeatModel.update({_id:oldDoc._id}, {$set :{  isListed:isListed,
                    collateralFactorMantissa:collateralFactorMantissa,
                    isComped:isComped}});
                    
            }

        }catch (e) {
            this.syncLogger.error('updateMarketsEnv - e: ', e);
        }

    }
    async getMarketEnv(ctokenAddr:string): Promise<any>{
        try{
            let oldDocs = await this.marketsEnvModel.find({
                cTokenAddr:ctokenAddr
            });
            let oldDoc = oldDocs[0];
            if(!oldDoc){
                return null;
            }else{
                return {
                    cTokenName:oldDoc.cTokenName,
                    isListed:oldDoc.isListed,
                    collateralFactorMantissa:oldDoc.collateralFactorMantissa,
                    isComped:oldDoc.isComped
                }
            }

        }catch (e) {
            this.syncLogger.error('getMarketEnv - e: ', e);
        }

    }
    async updateHeartBeat(type:string, timestamp:number){
        try {
            let oldDocs = await this.heartBeatModel.find({type:type});
            let oldDoc = oldDocs[0];
            if(!oldDoc){
                let doc = new this.heartBeatModel({
                    type:type,
                    timestamp:timestamp
                });
                let newDoc = await doc.save();
                if(newDoc){
                    this.syncLogger.debug('create new heartbeat: ', type, ': ', timestamp);
                }
            }else{
                let ret = await this.heartBeatModel.update({_id:oldDoc._id}, {$set :{ timestamp:timestamp}})
            }
        }catch (e) {
            this.syncLogger.error('e: ', e);
        }
    }
    async getHeartBeat(type:string){
        try {
            let oldDocs = await this.heartBeatModel.find({type:type});
            let oldDoc = oldDocs[0];
            if(!oldDoc){

                return null;
            }else{

                return oldDoc.timestamp;
            }
        }catch (e) {
            this.syncLogger.error('e: ', e);
        }
    }
    async updateUserBalance(userAddr:string, wanBalance:string){
        try {
            let oldDocs = await this.balanceModel.find({
                tokenName: 'WAN',
                userAddr:userAddr.toLowerCase()
            });
            let oldDoc = oldDocs[0];
            if (!oldDoc ) {
                let doc = new this.balanceModel({
                    tokenName: 'WAN',
                    tokenAddr: '0x0000000000000000000000000000000000000000',
                    userAddr:userAddr.toLowerCase(),
                    balance: wanBalance

                });

                let newDoc = await doc.save();
                this.syncLogger.debug('newDoc: ', newDoc);

            }else if(oldDoc.balance !== wanBalance){

                let ret = await this.balanceModel.update({ _id:oldDoc._id }, { $set: { balance: wanBalance }});
                this.syncLogger.info(ret);
            }
        }catch (e) {
            this.syncLogger.error(e);
        }
    }
    async getUserWanBalance(userAddr:string):Promise<string>{
        try{
            let oldDocs = await this.balanceModel.find({
                tokenName:'WAN',userAddr:userAddr.toLowerCase()
            });
            if(oldDocs.length ===0){
                return '0';
            }else{
                let oldDoc = oldDocs[0];
                return oldDoc.balance;
            }
        }catch (e) {
            this.syncLogger.error(e);
        }
    }
    async updateUserTokenBalance(tokenName:string, tokenAddr:string, userAddr:string, wanBalance:string){
        try {
            let oldDocs = await this.balanceModel.find({
                tokenAddr: tokenAddr.toLowerCase(),
                userAddr:userAddr.toLowerCase()
            });
            let oldDoc = oldDocs[0];
            if (!oldDoc ) {
                let doc = new this.balanceModel({
                    tokenName: tokenName,
                    tokenAddr: tokenAddr.toLowerCase(),
                    userAddr:userAddr.toLowerCase(),
                    balance: wanBalance

                });

                let newDoc = await doc.save();
                this.syncLogger.debug('newDoc: ', newDoc);

            }else if(oldDoc.balance !== wanBalance){

                let ret = await this.balanceModel.update({ _id:oldDoc._id }, { $set: { balance: wanBalance }});
                this.syncLogger.info(ret);
            }
        }catch (e) {
            this.syncLogger.error(e);
        }
    }
    async getUserTokenBalance(tokenAddr:string, userAddr:string):Promise<string>{
        try{
            let oldDocs = await this.balanceModel.find({
                tokenAddr:tokenAddr.toLowerCase(),userAddr:userAddr.toLowerCase()
            });
            if(oldDocs.length ===0){
                return '0';
            }else{
                let oldDoc = oldDocs[0];
                return oldDoc.balance;
            }
        }catch (e) {
            this.syncLogger.error(e);

        }

    }

    async updateExchangeRate(cTokenName:string, cTokenAddr:string, exchangeRate:string){
        try{
            let oldDocs = await this.cTokenExchangeRateModel.find({
                cTokenAddr:cTokenAddr.toLowerCase()
            });
            if(oldDocs.length == 0){
                let newDoc = new this.cTokenExchangeRateModel({
                    cTokenName: cTokenName,
                    cTokenAddr: cTokenAddr.toLowerCase(),
                    exchangeRate: exchangeRate
                });
                let ret = await newDoc.save();
                this.syncLogger.debug('ret: ', ret);
            }else{
                let oldDoc = oldDocs[0];
                if(oldDoc.exchangeRate !== exchangeRate){
                    let ret = await this.cTokenExchangeRateModel.update({_id:oldDoc._id},{$set:{
                            exchangeRate: exchangeRate

                        }});
                    this.syncLogger.debug('ret: ', ret);
                }
            }
        }catch (e) {
            this.syncLogger.error('e');
        }

    }
    async getExchangeRate( cTokenAddr:string):Promise<string>{
        try{
            let oldDocs = await this.cTokenExchangeRateModel.find({
                cTokenAddr:cTokenAddr.toLowerCase()
            });
            if(oldDocs.length == 0){
                return '0'
            }else{
                let oldDoc = oldDocs[0];
                return oldDoc.exchangeRate;
            }
        }catch (e) {
            this.syncLogger.error('e');
        }
    }

    async updateCloseFactor(closeFactor:string){
        try{
            let oldDocs = await this.marketParamModel.find({
                name:"closeFactor"
            });
            let oldDoc= oldDocs[0];
            if(!oldDoc){
                let newDoc = new this.marketParamModel({
                    name: "closeFactor",
                    value: closeFactor
                });
                let doc = await newDoc.save();
                
            }else{
                if(oldDoc.closeFactor !== closeFactor){
                    let ret  = await this.marketParamModel.updateOne({_id: oldDoc._id} ,{$set :{ value: closeFactor}});
                    
                }
            }
        }catch (e) {
            this.syncLogger.error('e: ',e);
        }
    }
    async getCloseFactor(){
        try{
            let oldDocs = await this.marketParamModel.find({
                name:"closeFactor"
            });
            let oldDoc= oldDocs[0];
            if(!oldDoc){
                return '0'
            }else{
                return oldDoc.value
            }
        }catch (e) {
            this.syncLogger.error('e: ',e);
        }
    }

    async updateLiquidationIncentive(liquidIncent:string){
        try{
            let oldDocs = await this.marketParamModel.find({
                name: "liquidationIncentive"
            });
            let oldDoc= oldDocs[0];
            if(!oldDoc){
                let newDoc = new this.marketParamModel({
                    name: "liquidationIncentive",
                    value: liquidIncent
                });
                let doc = await newDoc.save();
                
            }else{
                if( oldDoc.value !== liquidIncent){
                    let ret  = await this.marketParamModel.updateOne({_id: oldDoc._id} ,{$set :{ value: liquidIncent}});
                }
            }
        }catch (e) {
            this.syncLogger.error('e: ',e);
        }
    }
    async getLiquidationIncentive():Promise<string>{
        try{
            let oldDocs = await this.marketParamModel.find({
                name: "liquidationIncentive"
            });
            let oldDoc= oldDocs[0];
            if(!oldDoc){
                return '0';
            }else{
                return oldDoc.value;
            }
        }catch (e) {
            this.syncLogger.error('e: ',e);
        }

    }

    async updateMaxAssets(maxAssets:string){
        try{
            let oldDocs = await this.marketParamModel.find({
                name:"maxAssets"
            });
            let oldDoc= oldDocs[0];
            if(!oldDoc){
                let newDoc = new this.marketParamModel({
                    name: "maxAssets",
                    value: maxAssets
                });
                let doc = await newDoc.save();

            }else{
                if(oldDoc.maxAssets !== maxAssets){
                    let ret  = await this.marketParamModel.updateOne({_id: oldDoc._id} ,{$set :{ value: maxAssets}});

                }
            }
        }catch (e) {
            this.syncLogger.error('e: ',e);
        }
    }
    async getMaxAssets(){
        try{
            let oldDocs = await this.marketParamModel.find({
                name:"maxAssets"
            });
            let oldDoc= oldDocs[0];
            if(!oldDoc){
                return '0'
            }else{
                return oldDoc.value
            }
        }catch (e) {
            this.syncLogger.error('e: ',e);
        }
    }

    async updateCTokenUnderlyingPrice(ctokenName:string, ctokenAddr:string, price:string,decimal:number){
        try{
            let oldDocs = await this.cTokenUnderlyingPriceModel.find({
                cTokenAddr:ctokenAddr.toLowerCase()
            });
            let oldDoc = oldDocs[0];
            if(!oldDoc){
                let newDoc = new this.cTokenUnderlyingPriceModel({
                    cTokenName: ctokenName,
                    cTokenAddr : ctokenAddr.toLowerCase(),
                    price: price,
                    decimal:decimal,

                })
                let ret = await newDoc.save();
                
            }else{
                let oldPrice = Number(oldDoc.price);
                let newPirce = Number(price);
                if(oldPrice !== newPirce){
                    if(decimal !== oldDoc.decimal){
                        let ret = await this.cTokenUnderlyingPriceModel.update({_id:oldDoc._id},{$set:{price: price, decimal:decimal}});
                    }else{
                        let ret = await this.cTokenUnderlyingPriceModel.update({_id:oldDoc._id},{$set:{price: price}});
                    }


                }
            }
        }catch (e) {
            this.syncLogger.info('updateCTokenUnderlyingPrice e: ',e);
        }
    }
    async getCTokenUnderlyingPrice(ctokenAddr:string){
        try{
            let oldDocs = await this.cTokenUnderlyingPriceModel.find({
                cTokenAddr:ctokenAddr.toLowerCase()
            });
            let oldDoc = oldDocs[0];
            if(!oldDoc){
                return null;
            }else{
                return {
                    price:oldDoc.price,
                    decimal:oldDoc.decimal
                };
            }
        }catch (e) {
            this.syncLogger.info('e: ',e);
        }
    }
    async updateCTokenBalance(tokenName:string, tokenAddr:string, userAddr:string, balance:string){
        try{
            let oldDocs = await this.ctokenBalanceModel.find({
                tokenAddr: tokenAddr.toLowerCase(),
                userAddr:userAddr.toLowerCase()
            });
            let oldDoc = oldDocs[0];
            if (!oldDoc ) {
                let doc = new this.ctokenBalanceModel({
                    tokenName: tokenName,
                    tokenAddr: tokenAddr.toLowerCase(),
                    userAddr:userAddr.toLowerCase(),
                    balance: balance

                });

                let newDoc = await doc.save();
                this.syncLogger.debug('updateCTokenBalance -- newDoc: ', newDoc);

            }else if(oldDoc.balance !== balance){

                let ret = await this.balanceModel.update({ _id:oldDoc._id }, { $set: { balance: balance }});
                this.syncLogger.info(ret);
            }
        }catch (e) {
            this.syncLogger.info('updateCTokenBalance - e: ',e);
        }
    }
    async getCTokenBalance(tokenName:string, tokenAddr:string, userAddr:string){
        try{
            let oldDocs = await this.ctokenBalanceModel.find({
                tokenAddr: tokenAddr.toLowerCase(),
                userAddr:userAddr.toLowerCase()
            });
            let oldDoc = oldDocs[0];
            if(!oldDoc){
                return null;
            }else{
                return oldDoc.balance;
            }

        }catch(e){
            this.syncLogger.info('e: ',e);
        }
    }

}

export default Storage;