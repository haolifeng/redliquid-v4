
import CTokenData from "./CTokenData";
import config from '../config';
import {logger} from '../common/logger';


class AccountData {
    public address:string;  //账号地址
    public health:string;   //健康值， 小于1 不需要清算
    public net_asset_value:string; // 账号净值（以wan为单位）
    public total_borrow_value:string;  //账号总借款价值，以wan为单位
    public total_collateral_value:string;//账号抵押资产总价值，以wan为单位
    public borrowTokens:CTokenData[];
    public supplyTokens:CTokenData[];
    public status:number;
    constructor(_address,
                _health,
                _net_asset_value,
                _total_borrow_value,
                _total_collateral_value){
        this.address = _address;
        this.health = _health;
        this.net_asset_value = _net_asset_value;
        this.total_borrow_value = _total_borrow_value;
        this.total_collateral_value = _total_collateral_value;
        this.status = 0;
        this.borrowTokens = [];
        this.supplyTokens = [];

    }
    addToken(rawTokenList){
        for(let token of rawTokenList){

            let bnBorrow_balance_underlying = parseFloat(token.borrow_balance_underlying);
            let bnSupply_balance_underlying = parseFloat(token.supply_balance_underlying);

                if(bnBorrow_balance_underlying !== 0.0 ) {
                    if(token.token_address.toLowerCase() !== '0x3c2edaa754cbc179cec5659483f336c8af303749'){
                        let tokenData = new CTokenData(token.token_address, token.borrow_balance_underlying);
                        this.borrowTokens.push(tokenData);
                    }
                }
                if(bnSupply_balance_underlying !== 0.0){
                    if(token.token_address.toLowerCase() !== '0x3c2edaa754cbc179cec5659483f336c8af303749'){
                    let tokenData = new CTokenData(token.token_address, token.supply_balance_underlying);
                    this.supplyTokens.push(tokenData);
                }

            }

        }
    }

    walkBorrowTokens(){
        for(let token of this.borrowTokens){
            logger.debug(`name: ${token.cTokenName}, address: ${token.cTokenAddress}, borrowBalance: ${token.underlyTokenAmount.toString()}, underlyTokenAddress:${token.underlyTokenAddress}`)
        }
    }
    walkSupplyTokens(){
        for(let token of this.supplyTokens){
            logger.debug(`name: ${token.cTokenName}, address: ${token.cTokenAddress}, supplyBalance: ${token.underlyTokenAmount.toString()}, underlyTokenAddress:${token.underlyTokenAddress}`)
        }
    }

}

export default AccountData;