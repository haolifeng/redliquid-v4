import {BigNumber, ethers} from 'ethers';

import config from '../config/index';
import { logger } from '../common/logger';
class Comptroller {
    private scAddress:string;
    private abi:any;
    private nodeUrl:string;
    private chainId:number;
    private provider: ethers.providers.JsonRpcBatchProvider;
    private scInstance : ethers.Contract;
    private overrides:any;
    constructor(){
        this.abi = config.abi.comptrollerAbi;
        this.scAddress = config.config_mainnet.Unitroller;
        this.nodeUrl = config.wanChain.nodeUrl;
        this.chainId= config.wanChain.chainId;
        this.provider = new ethers.providers.JsonRpcBatchProvider(this.nodeUrl);
        this.scInstance = new ethers.Contract(this.scAddress,this.abi,this.provider);

    }
    async closeFactor(){
        let closeFactor = await this.scInstance.closeFactorMantissa();
        return closeFactor;
    }
    async liquidationIncentive(){
        let liquidationIncentive = await this.scInstance.liquidationIncentiveMantissa();
        return liquidationIncentive;
    }
    async markets(address:string){
        let market = await this.scInstance.markets(address);
        return market;
    }
    async amountToBeLiquidatedSieze( _cToken,  _cTokenCollateral, _actualRepayAmount) {
        let account = await this.scInstance.liquidateCalculateSeizeTokens(
            _cToken,
            _cTokenCollateral,
            _actualRepayAmount
        );
        return account;

    }
    async enterMarkets(wallet,ctokenArray){
        try{
            let newWallet = wallet.connect(this.provider);
            const scInstanceWithSigner = this.scInstance.connect(newWallet);

            let receipt = await scInstanceWithSigner.enterMarkets(ctokenArray);
            return receipt;
        }catch (e) {
            logger.error('e: ',e);
            if(e.code === 'UNKNOWN_ERROR' && e.reason === 'Transaction hash mismatch from Provider.sendTransaction.'){
                let txHash = e.returnedHash;

                let receipt = await this.provider.getTransactionReceipt(txHash);
                return receipt;

            }else{
                
                return null;
            }
        }
    }

    async liquidateCalculateSeizeTokens(ctokenAddress, ctokenCalatorAddress, amount){
        const newScInstance = this.scInstance.connect(this.provider);
        let receiptAmount = await newScInstance.liquidateCalculateSeizeTokens(ctokenAddress,ctokenCalatorAddress,amount);
        return receiptAmount;
    }

    async getHypotheticalAccountLiquidity(account:string, cTokenModify, redeemTokens:BigNumber, borrowAmount:BigNumber){
        try{
            let liquidity = await this.scInstance.getHypotheticalAccountLiquidity(account,cTokenModify,redeemTokens, borrowAmount);
            return liquidity;
        }catch (e) {
            logger.error('e: ',e);
            return false;
        }
    }
    async checkMembership(account:string, ctoken:string){
        try{
            let liquidity = await this.scInstance.checkMembership(account,ctoken);
            return liquidity;
        }catch (e) {
            logger.error('e: ',e);
            return false;
        }

    }
    async claimComp(wallet:ethers.Wallet, holderAddr:string){
        try{
            let newWallet = wallet.connect(this.provider);
            const scInstanceWithSigner = this.scInstance.connect(newWallet);

            let tx = await scInstanceWithSigner.claimComp(holderAddr);
            let receipt = await tx.wait();
            return receipt;
        }catch (e) {
            console.log('e: ',e);
            if(e.code === 'UNKNOWN_ERROR' && e.reason === 'Transaction hash mismatch from Provider.sendTransaction.'){
                let txHash = e.returnedHash;

                let receipt = await this.provider.getTransactionReceipt(txHash);
                return receipt;

            }else{
                console.log('e: ',e);
                return null;
            }
        }

    }
    async maxAssets(){
        try{

            let ret = await this.scInstance.maxAssets();
            return ret;

        }catch (e) {
            logger.error('maxAssets e: ', e);
        }
    }
    async getAccountLiquidity(account:string){
        try{

            let ret = await this.scInstance.getAccountLiquidity(account);
            return ret;

        }catch (e) {
            logger.error('getAccountLiquidty e: ', e);
        }
    }
    async borrowCaps(ctokenAddr :string){
        try{
            let ret = await this.scInstance.borrowCaps(ctokenAddr);
            return ret;
        }catch (e) {
            logger.error('getAccountLiquidty e: ', e);
        }
    }
}
let comptroller = new Comptroller();

export default comptroller;