const RedController = artifacts.require("RedController");

const RedLiquid = artifacts.require('RedLiquid');

module.exports = async function (deployer) {
    await deployer.deploy(RedController);
    await deployer.deploy(RedLiquid);


};