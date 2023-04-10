import addr2UnderlyTokeName from "./addr2UnderlyTokenName";
import * as fs from "fs";
let objs = {}
for(let address in addr2UnderlyTokeName){
    objs[address.toLowerCase()] = addr2UnderlyTokeName[address];
}

fs.writeFile('add2UnderlyingTokenName.json',JSON.stringify(objs),(err)=>{
    console.log('write file complete');
});