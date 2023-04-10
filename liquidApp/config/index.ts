const gconfig = require('../../gconfig/config.json');
import words from './.words';


import underlyingTokenName2Addr from "./underlyingTokens";
import underlyingTokenInfo from "./underlyingTokenInfo";
import ctokenName2Addr from "./ctokenName2Addr";

import abi from './abi'

const paths = require('./paths.json');
const config_mainnet = require('./config_mainnet.json');

let config = {
    wanChain:gconfig.wanChain,

    
    lendApi:'https://v2.wanlend.finance:8889/account?max_health=1',
    lendApiPre:'https://v2.wanlend.finance:8889/account?max_health=0.95',
    SwapRouterScAddr:'0xeA300406FE2eED9CD2bF5c47D01BECa8Ad294Ec1',
    ComptrollerScAddr:'0xd6980C52C20Fb106e54cC6c8AE04c089C3F6B9d6',// in fact, it is unitroller address



    words:words,
    config_mainnet: config_mainnet,
    ctokenName2Addr:ctokenName2Addr,
    underlyingTokenInfo:underlyingTokenInfo,
    underlyingTokenName2Addr:underlyingTokenName2Addr,
    abi:abi,
    paths:paths,
    log:{
        loglevel:'info',
        logfile:'log/liquidsystem.log',
        logErrorFile:'log/liquidSystem_error.log',
        syncLogfile:'log/liquidSync.log',
        syncErrorFile:'log/liquidSync_error.log',
        checkLogFile:'log/check.log',
        checkErrorFile:'log/check_error.log',
        preLogfile:'log/preLiquid.log',
        preErrorFile:'log/preLiquid_error.log',
    },
    storage:{
        dbUrl:'mongodb://127.0.0.1:27017/flyliquid-one',
        promiseTimeout: 300 * 1000,
        balanceModelName:'Balance',
        marketParamModelName:'MarketParams',
        cTokenUnderlyingPriceModelName:'CTokenUnderlyingPrice',
        cTokenExchangeRateModelName:'ExchangeRate',
        heartBeatModelName:'HeartBeat',
        cTokenBalanceModelName:'CTokenBalance',
        marketsEnvModuleName:'MarketsEnv',
    },
}

export default config;