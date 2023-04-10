import BaseErc20 from "../common/BaseErc20";

import config from '../config';

let underlyingTokenMap = new Map();
let nodeUrl = config.wanChain.nodeUrl;

let underlyingTokenInfo = config.underlyingTokenInfo;

for(let key in underlyingTokenInfo){
    for (let key in underlyingTokenInfo){
        if(key === 'WAN'){
            continue;
        }
        let tokenInfo = underlyingTokenInfo[key];
        let tokenSc = new BaseErc20(nodeUrl,tokenInfo.address,key,tokenInfo.decimal);
        underlyingTokenMap.set(tokenInfo.address.toLowerCase(), tokenSc);

    }
}

export default underlyingTokenMap;