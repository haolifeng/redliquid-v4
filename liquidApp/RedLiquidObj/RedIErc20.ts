import RedBase from "./RedBase";
import {ethers ,BigNumber} from 'ethers';
class RedIErc20 extends RedBase {
    constructor(scAddr, nodeUrl, abi) {
        super(scAddr, nodeUrl, abi);
    }

    async IERC20Balance(erc20Addr) {
        let erc20Balance = await this.scInst.IERC20Balance(erc20Addr);
        return erc20Balance;
    }

    async IERC20transfer(wallet: ethers.Wallet, erc20Addr: string, recipient: string, amount: BigNumber) {
        let signer = wallet.connect(this.provider);
        let signedSc = this.scInst.connect(signer);
        let tx = await signedSc.IERC20transfer(erc20Addr, recipient, amount,{
            gasLimit:'5000000'
        });
        let rect = await tx.wait();

        return rect;
    }

    async IERC20Approve(wallet: ethers.Wallet, erc20Addr: string, sender: string, amount: BigNumber) {
        let signer = wallet.connect(this.provider);
        let signedSc = this.scInst.connect(signer);
        let tx = await signedSc.IERC20Approve(erc20Addr, sender, amount,{
            gasLimit:'9000000'
        });
        let rect = await tx.wait();

        return rect;


    }
}

export default RedIErc20;