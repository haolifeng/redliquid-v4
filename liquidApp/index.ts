import yargs from 'yargs';
import {hideBin} from "yargs/helpers"

import dataApp from './dataApp';
import fnLiquid from './fnLiquid';

const argv = hideBin(process.argv);
const cli = yargs(argv);
const args = cli.options({
    s : {type :'number', alias:'timeout',default:5000},
    t : {type :'string', alias:'type'},
}).parseSync();

if (args.type==="data"){
    dataApp(args.s);
}else{
    fnLiquid(args.s);
}


