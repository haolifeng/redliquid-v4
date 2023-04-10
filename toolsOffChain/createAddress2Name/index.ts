
import * as fs from 'fs';
import config from '../../config';

let  config_mainnet = config.config_mainnet;

let address2Name = {};
for(let name in config_mainnet){
    let address = config_mainnet[name];
    address2Name[address] = name;

}

fs.writeFile('./address2CTokenName.json',JSON.stringify(address2Name),err => {
    console.log('write file complete');
})