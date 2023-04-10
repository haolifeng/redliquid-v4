import computerPath from "./computerPath";

import appConfig from '../../config';

const tokenPairs = appConfig.swap.tokenPairs;

const pathTokenPairs = [];

for(let key in tokenPairs){
    let value = tokenPairs[key];
    pathTokenPairs.push(value);

}

let WAN2USDT = tokenPairs.WAN2USDT;
let WAN2ETH= tokenPairs.WAN2ETH;

let USDT2USDC= tokenPairs.USDT2USDC;
let WASP2WAN= tokenPairs.WASP2WAN;

let WAN2BTC = tokenPairs.WAN2BTC;
let WAN2XRP  = tokenPairs.WAN2XRP;
let ZOO2WASP= tokenPairs.ZOO2WASP;
let WASP2DOGE  = tokenPairs.WASP2DOGE;
let WASP2LTC  = tokenPairs.WASP2LTC;
let WASP2WASP  = tokenPairs.WASP2WASP;
let MOVE2WASP  = tokenPairs.MOVE2WASP;
let DOT2WASP  = tokenPairs.DOT2WASP;
let WASP2BNB = tokenPairs.WASP2BNB;
let WASP2FTM  = tokenPairs.WASP2FTM;
let WASP2AVAX    = tokenPairs.WASP2AVAX;

let inAddr = MOVE2WASP[0];

let outAddr = WAN2USDT[0];

inAddr = WASP2DOGE[1];
outAddr = USDT2USDC[1];


let i = WAN2USDT[0];
let o = DOT2WASP[0];

let paths = computerPath(pathTokenPairs,i,o);

console.log('paths: ', paths);


