import { ethers ,BigNumber} from 'ethers';

import RedCToken from './RedCToken';
import config from '../config';
import {logger} from '../common/logger';

class RedLiquidObj extends RedCToken {
    constructor() {

        super(config.RedControllerScAddr, config.wanChain.nodeUrl, config.abi.RedLiquidAbi);
    }
    async liquidFnSwapExactTokensForTokens(wallet:ethers.Wallet, ctokenAddr:string,  ctokenUnderlyingtoken:string,  borrower:string,  amount:BigNumber,
                                           _cTokenCollateral:string,  _cTokenCollateralUnderlyingTokenAddr:string,   path:[]){
        /*
        * admin,liquidMarketData.cTokenAddress,
                            liquidMarketData.underlyTokenAddress,
                            userAddr,bnMostActualRepayAmount,collateMarketData.cTokenAddress,collateMarketData.underlyTokenAddress,path
        *
        * */
       
                            logger.info('ctokenAddr: ', ctokenAddr);
                            logger.info('ctokenUnderlyingtoken: ', ctokenUnderlyingtoken);
                            logger.info('borrower: ', borrower);
                            logger.info('amount: ', amount.toString());
                            logger.info('_ctokenCollateral: ', _cTokenCollateral);
                            logger.info('_cTokenCollateralUnderlyingTokenAddr: ', _cTokenCollateralUnderlyingTokenAddr);
        
         let signer = wallet.connect(this.provider);
         let signedSc = this.scInst.connect(signer);

        let gasPrice = await this.provider.getGasPrice();

        console.log('gasPrice : ', gasPrice.toString());
        let newGasPrice = gasPrice.add(gasPrice.mul(BigNumber.from('10')).div(BigNumber.from('100')));
        console.log('newGasPrice: ', newGasPrice.toString());

      let tx = await signedSc.liquidFnSwapExactTokensForTokens(ctokenAddr,  ctokenUnderlyingtoken,  borrower,  amount,
             _cTokenCollateral,  _cTokenCollateralUnderlyingTokenAddr,   path,{
              gasPrice:newGasPrice.toString(),
                 gasLimit:'8000000'
             });
         let rect = await tx.wait();

         return rect;

    }
    async liquidFnSwapExactETHForTokens(wallet:ethers.Wallet,  ctokenAddr:string,  ctokenUnderlyingtoken:string,  borrower:string,  amount:BigNumber,
                                        _cWanCollateral:string, path:string[]){
                                            logger.info('ctokenAddr: ', ctokenAddr);
                                            logger.info('ctokenUnderlyingtoken: ', ctokenUnderlyingtoken);
                                            logger.info('borrower: ', borrower);
                                            logger.info('amount: ', amount.toString());
                                            logger.info('_cWanCollateral: ', _cWanCollateral);



        let signer = wallet.connect(this.provider);
        let signedSc = this.scInst.connect(signer);
        let gasPrice = await this.provider.getGasPrice();

        console.log('gasPrice : ', gasPrice.toString());
        let newGasPrice = gasPrice.add(gasPrice.mul(BigNumber.from('10')).div(BigNumber.from('100')));
        console.log('newGasPrice: ', newGasPrice.toString());
        let tx = await signedSc.liquidFnSwapExactETHForTokens(ctokenAddr,  ctokenUnderlyingtoken,  borrower,  amount,
            _cWanCollateral, path,{
                gasPrice:newGasPrice.toString(),
                gasLimit:'8000000'
            });
        let rect = await tx.wait();

        return rect;
    }
    async liquidFnSwapExactTokensForETH(wallet:ethers.Wallet,  cWanAddr:string,  borrower:string,  amount:BigNumber,
                                        _cTokenCollateral:string,  _cTokenCollateralUnderlyingTokenAddr:string,  path:[]){
        let signer = wallet.connect(this.provider);
        let signedSc = this.scInst.connect(signer);

        let gasPrice = await this.provider.getGasPrice();

        console.log('gasPrice : ', gasPrice.toString());
        let newGasPrice = gasPrice.add(gasPrice.mul(BigNumber.from('10')).div(BigNumber.from('100')));
        console.log('newGasPrice: ', newGasPrice.toString());

        let tx = await signedSc.liquidFnSwapExactTokensForETH(cWanAddr,  borrower,  amount,
            _cTokenCollateral,  _cTokenCollateralUnderlyingTokenAddr,  path,{
                gasPrice:newGasPrice.toString(),
                gasLimit:'8000000'
            });
        let rect = await tx.wait();

        return rect;
    }
    async enterMarkets(wallet:ethers.Wallet, cTokens:string[]){
        let signer = wallet.connect(this.provider);
        let signedSc = this.scInst.connect(signer);
        let tx = await signedSc.enterMarkets(cTokens,{
                gasLimit:'50000000'
            });
        let rect = await tx.wait();

        return rect;
    }
    async setRouter(wallet:ethers.Wallet){
        let signer = wallet.connect(this.provider);
        let signedSc = this.scInst.connect(signer);
        let tx = await signedSc.setRouter(config.SwapRouterScAddr,{
            gasLimit:'50000000'
        });
        let rect = await tx.wait();

        return rect;
    }
    async setComptroller(wallet:ethers.Wallet){
        let signer = wallet.connect(this.provider);
        let signedSc = this.scInst.connect(signer);
        let tx = await signedSc.setComptroller(config.ComptrollerScAddr,{
            gasLimit:'50000000'
        });
        let rect = await tx.wait();

        return rect;
    }
}

let redLiquidObj = new RedLiquidObj();
export default redLiquidObj;