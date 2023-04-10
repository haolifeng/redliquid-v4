import computerPath from "./computerPath";

import appConfig from '../../config';

const tokenPairs = appConfig.swap.tokenPairs;

const pathTokenPairs = [];

for(let key in tokenPairs){
     let value = tokenPairs[key];
     pathTokenPairs.push(value);

}

let inAddr = tokenPairs['WAN2USDT'][0];
let outAddr = tokenPairs['WAN2USDT'][1];


let usdt2usdc = tokenPairs.USDT2USDC;

computerPath(pathTokenPairs,inAddr, usdt2usdc[1]);