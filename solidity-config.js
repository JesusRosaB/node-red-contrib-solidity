module.exports = function(RED) {
  function SolidityConfigNode(config) {
      RED.nodes.createNode(this, config);
      this.network = config.network;
      this.privatekey = config.privatekey;
  }
  RED.nodes.registerType('solidity-config', SolidityConfigNode);
};