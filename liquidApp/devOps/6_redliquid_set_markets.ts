import config from '../config';



import admin from '../wallet';


import redLiquidObj from '../RedLiquidObj/RedLiquidObj';


const f = async ()=>{
    let ctokenNam2Addr = config.ctokenName2Addr;
    let ctokens:string[] = [];
    for(let name in ctokenNam2Addr){
        ctokens.push(ctokenNam2Addr[name]);
    }
    console.log('ctokens: ', ctokens);
    let ret  = await redLiquidObj.enterMarkets(admin,ctokens);
    console.log('ret: ', ret);
}
f();