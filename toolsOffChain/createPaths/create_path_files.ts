import * as fs from 'fs';

import computerPath from "./computerPath";

import appConfig from '../../config';

const tokenPairs = appConfig.swap.tokenPairs;

const pathTokenPairs = [];

for(let key in tokenPairs){
    let value = tokenPairs[key];
    pathTokenPairs.push(value);

}

let tokens = appConfig.swap.tokens;

let pathObj = {};

for(let key1 in tokens){
    for(let key2 in tokens){
        if(key1 !== key2){
            let inAddr = tokens[key1];
            let outAddr = tokens[key2];
            let paths = computerPath(pathTokenPairs,inAddr, outAddr);
            let pathKey = key1 + '2' + key2;
            pathObj[pathKey] = paths;
        }
    }
}

fs.writeFile('./paths.json',JSON.stringify(pathObj),(error)=>{
    console.log('write file complete');
})