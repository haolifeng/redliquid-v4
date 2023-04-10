import findPreAccountSvr from '../liquidApp/preLiquidSvr/findPreAccountSvr';
import {idleSleep} from "./common/libs";

const main = async ()=>{
    while(1){
        await findPreAccountSvr.run();
        idleSleep(5000);
    }

}

main();