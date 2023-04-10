import findLiquidAccountSvr from "./liquidSvr/FindLiquidAccountSvr";
import liquidSvr from "./liquidSvr/LiquidSvr";
import { idleSleep } from './common/libs';
import {logger} from './common/logger';
async function  fnLiquid(time:number){
    while(1){
        await findLiquidAccountSvr.run();
        await liquidSvr.run();
        await idleSleep(time);

        logger.info(" in funLiquid ================================ run ")
        
    }
    
}

export default  fnLiquid;
