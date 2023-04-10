import RedIErc20 from "./RedIErc20";
import {BigNumber, ethers, utils} from "ethers";
import {logger} from '../common/logger';
class RedCToken extends RedIErc20 {
    constructor(scAddr, nodeUrl, abi) {
        super(scAddr, nodeUrl, abi);
    }
    async mintCToken(wallet:ethers.Wallet, cerc20Addr:string, amount:BigNumber){
        let signer = wallet.connect(this.provider);
        let sigedSc = this.scInst.connect(signer);

        let tx = await sigedSc.mintCToken(cerc20Addr, amount,{
            gasLimit:'8000000'
        });
        let ret = await tx.wait();
        logger.info('ret: ', ret);
        return ret;

    }
    async redeemCToken(wallet:ethers.Wallet, cerc20Addr:string, amount:BigNumber){
        let signer = wallet.connect(this.provider);
        let sigedSc = this.scInst.connect(signer);

        let tx = await sigedSc.redeemCToken(cerc20Addr, amount);
        let ret = await tx.wait();
        logger.info('ret: ', ret);
        return ret;
    }
    async redeemUnderlyingCToken(wallet:ethers.Wallet, cerc20Addr:string, amount:BigNumber){
        let signer = wallet.connect(this.provider);
        let sigedSc = this.scInst.connect(signer);

        let tx = await sigedSc.redeemUnderlyingCToken(cerc20Addr, amount);
        let ret = await tx.wait();
        logger.info('ret: ', ret);
        return ret;

    }
    async borrowCToken(wallet:ethers.Wallet, cerc20Addr:string, amount:BigNumber){
        let signer = wallet.connect(this.provider);
        let sigedSc = this.scInst.connect(signer);

        let tx = await sigedSc.borrowCToken(cerc20Addr, amount);
        let ret = await tx.wait();
        logger.info('ret: ', ret);
        return ret;
    }
    async repayBorrowCToken(wallet:ethers.Wallet, cerc20Addr:string, amount:BigNumber){
        let signer = wallet.connect(this.provider);
        let sigedSc = this.scInst.connect(signer);

        let tx = await sigedSc.repayBorrowCToken(cerc20Addr, amount);
        let ret = await tx.wait();
        logger.info('ret: ', ret);
        return ret;
    }
    async balanceOfCToken(cerc20Addr:string){
        let balance = await this.scInst.balanceOfCToken(cerc20Addr);
        return balance;
    }
    async liquidateBorrowCToken(wallet:ethers.Wallet, ctokenAddr:string,  token:string,  borrower:string,  amount:BigNumber,  _cTokenCollateral:string){
        //no need to implement
    }
    async mintWan(wallet:ethers.Wallet, _cethAddr:string, amount:BigNumber){
        let signer = wallet.connect(this.provider);
        let sigedSc = this.scInst.connect(signer);
        let tx = await sigedSc.mintWan(_cethAddr, amount,{
            gasLimit:'9000000'
        });
        let ret = await tx.wait();
        logger.info('ret: ', ret);
        return ret;
    }
    async redeemWan(wallet:ethers.Wallet, _cethAddr:string, amount:BigNumber){
        let signer = wallet.connect(this.provider);
        let sigedSc = this.scInst.connect(signer);
        let tx = await sigedSc.redeemWan(_cethAddr, amount,{
            gasLimit:'8000000'
        });
        let ret = await tx.wait();
        logger.info('ret: ', ret);
        return ret;
    }
    async redeemUnderlyingWan(wallet:ethers.Wallet, _cethAddr:string, amount:BigNumber){
        let signer = wallet.connect(this.provider);
        let sigedSc = this.scInst.connect(signer);
        let tx = await sigedSc.redeemUnderlyingWan(_cethAddr, amount);
        let ret = await tx.wait();
        logger.info('ret: ', ret);
        return ret;
    }
    async borrowWan(wallet:ethers.Wallet, _cethAddr:string, amount:BigNumber){
        let signer = wallet.connect(this.provider);
        let sigedSc = this.scInst.connect(signer);
        let tx = await sigedSc.borrowWan(_cethAddr, amount);
        let ret = await tx.wait();
        logger.info('ret: ', ret);
        return ret;
    }
    async repayBorrowWan(wallet:ethers.Wallet, _cethAddr:string, amount:BigNumber){
        let signer = wallet.connect(this.provider);
        let sigedSc = this.scInst.connect(signer);
        let tx = await sigedSc.repayBorrowWan(_cethAddr,amount,{
            gasLimit:'8000000'
        });
        let ret = await tx.wait();
        logger.info('ret: ', ret);
        return ret;
    }
    async liquidateBorrowWan(wallet:ethers.Wallet, _cethAddr:string,  borrower:string,   _cTokenCollateral:string){
        //void
    }

    async balanceOfCWan(cethAddr:string){
        let balance:any = this.scInst.balanceOfWan(cethAddr);
        return balance;

    }

}

export default RedCToken;