import BaseErc20 from "../common/BaseErc20";

import config from '../config';

const CompoundScAddr = config.config_mainnet.Comp;
const url = config.wanChain.nodeUrl;


class CompToken extends BaseErc20 {
    constructor() {
        super(url, CompoundScAddr, 'Comp', 18);
    }
}

let compToken = new CompToken();

export default compToken;

