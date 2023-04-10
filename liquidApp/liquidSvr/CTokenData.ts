
import { ctokenMap} from '../CTokens/index';
class CTokenData {
    public cTokenAddress:string;  //market address , ctoken address
    public underlyTokenAmount:string;
    public cTokenName:string;
    public underlyTokenAddress: string;
    public ctokenInst:any;
    public underlyingScInst:any;
    /*
        account_address:string;
        token_address:string;
        is_entered:boolean;
        account_total_borrow:string;
        account_total_repay:string;
        account_total_supply:string;
        account_total_redeem:string;
        borrow_balance_underlying:string;
        lifetime_borrow_interest_accrued:string;
        lifetime_supply_interest_accrued:string;
        supply_balance:string;
        supply_balance_underlying:string; */

    constructor(_address,_sum){
      
        this.cTokenAddress = _address;
        this.underlyTokenAmount = _sum;
        
        this.ctokenInst = ctokenMap.get(_address);
        this.cTokenName = this.ctokenInst.localName;
        this.underlyingScInst = this.ctokenInst.underlyingTokenObj;
        if(this.underlyingScInst){
            this.underlyTokenAddress = this.underlyingScInst.scAddr;
        }else{
            this.underlyTokenAddress = '0x0000000000000000000000000000000000000000';
        }

    }

}

export default CTokenData;