import { ethers } from 'ethers';
import config from '../config';
let admin = ethers.Wallet.fromMnemonic(config.words);

//console.log('admin.address: ', admin.address);

export default admin;