import underlyingTokenConfig from "../config/underlyingTokenConfig";
import * as fs from "fs";

let obj = {};

for( let key in underlyingTokenConfig){
    let tokenInfo = underlyingTokenConfig[key];
    obj[tokenInfo.address] = key;
}

fs.writeFile('./addr2underlytokenName.ts',JSON.stringify(obj),err => {
    console.log('finish');
})