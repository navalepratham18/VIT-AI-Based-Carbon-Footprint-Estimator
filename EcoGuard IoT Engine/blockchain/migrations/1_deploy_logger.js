const CarbonFootprintLogger = artifacts.require("CarbonFootprintLogger");

module.exports = function (deployer) {
  // This tells Truffle to take the compiled contract and push it to the network
  deployer.deploy(CarbonFootprintLogger);
};