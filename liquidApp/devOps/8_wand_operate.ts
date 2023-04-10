import config from '../config';
import { BigNumber, ethers } from 'ethers';


import admin from '../wallet';
const  RedLiquidScAddr = config.RedControllerScAddr;

import redLiquidObj from '../RedLiquidObj/RedLiquidObj';

const wandScAddr = config.underlyingTokenName2Addr.WAND;


import { comptroller} from "../CTokens";

const run = async ()=>{


    //let w2WandBalance = await redLiquidObj.balanceOfCToken(wandScAddr);
    //console.log('w2WandBalance -- old :', w2WandBalance.toString());

    //let ret = await comptroller.claimComp(admin,RedLiquidScAddr);
    //console.log('ret: ', ret);

    let w2WandBalance2 = await redLiquidObj.balanceOfCToken(wandScAddr);
    console.log('w2WandBalance -- new:', w2WandBalance2.toString());

    let ret = await redLiquidObj.IERC20transfer(admin, wandScAddr, '0x8E7fbb49f436d0e8a50c02F631e729A57a9a0aCA', w2WandBalance2.sub(BigNumber.from('1')));
    console.log('ret: ', ret);

}

run();