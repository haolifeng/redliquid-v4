import * as fs from "fs";

let date= {
    "w2WAN":"WAN",
    'w2wanBTC':"BTC",
    'w2wanETH':"ETH",
    'w2wanUSDT':"USDT",
    'w2wanUSDC':"USDC",
    'w2wanXRP':'XRP',
    'w2wanBNB':'BNB',
    'w2wanDOT':'DOT',
    'w2wanAVAX':'AVAX',
    'w2wanMOVR':'MOVR',
    'w2WASP':'WASP',
    'w2ZOO':'ZOO',
    'w2WAND':'WAND',
    'w2wanLTC':'LTC',
    'w2wanDOGE':'DOGE',
    'w2wanFTM':'FTM',
    'w2GLMR':'GLMR'

}


let Objs = {}
for (let key in date){
    Objs[date[key]] = key;
    Objs[key] = date[key];
}

fs.writeFile('../config/tokenNameMap.ts',JSON.stringify(Objs),(err)=>{
    console.log('write file complete');
});