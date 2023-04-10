import * as fs from 'fs';
import Addr2CTokenName from "../config/addr2CTokenName";
let Objs = {}
for (let key in Addr2CTokenName){
    Objs[Addr2CTokenName[key]] = key;
}

fs.writeFile('ctokenName2Addr.ts',JSON.stringify(Objs),(err)=>{
    console.log('write file complete');
});