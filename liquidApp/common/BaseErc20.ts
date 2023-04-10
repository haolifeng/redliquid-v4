let abi = require('../config/abi/ERC20.json');
import { ethers,BigNumber } from 'ethers';
class BaseErc20 {
    private provider:ethers.providers.JsonRpcProvider;
    private scInst:ethers.Contract;
    public scAddr:string;
    public localName:string;
    public localDecimal:number;
    constructor(url:string,scAddr:string,name:string,decimal:number){
        this.scAddr = scAddr;
        this.localName = name;
        this.localDecimal = decimal;
        this.provider = new ethers.providers.JsonRpcProvider(url);
        this.scInst = new ethers.Contract(this.scAddr, abi, this.provider);

    }
    async balanceOf(owner:string){
        let ret:any = await this.scInst.balanceOf(owner);

        return ret;
    }
    async allowance(owner:string, spender:string){
        let ret:any = await this.scInst.allowance(owner, spender);
        return ret;

    }
    async name():Promise<string>{
        let name:string = await this.scInst.name();

        return name;

    }
    async symbol():Promise<string>{
        let symbol:string = await this.scInst.symbol();
        return symbol;
    }
    async decimals():Promise<any>{
        let decimals:any = await this.scInst.decimals();
        return decimals;
    }
    async transfer(wallet:ethers.Wallet, to:string, value:BigNumber ){
        let newWallet = wallet.connect(this.provider);
        let newScInst = this.scInst.connect(newWallet);

        let tx = await newScInst.transfer(to, value);
        let receipt = await tx.wait();
        return receipt;

    }
    async transferFrom(wallet:ethers.Wallet, from:string, to:string, value:BigNumber ){
        let newWallet = wallet.connect(this.provider);
        let newScInst = this.scInst.connect(newWallet);

        let tx = await newScInst.transferFrom(from,to, value);
        let receipt = await tx.wait();
        return receipt;
    }
    async approve(wallet:ethers.Wallet, spender:string, value:BigNumber){
        let newWallet = wallet.connect(this.provider);
        let newScInst = this.scInst.connect(newWallet);

        let tx = await newScInst.approve(spender, value);
        let receipt = await tx.wait();

        return receipt;
    }

}

export default BaseErc20;