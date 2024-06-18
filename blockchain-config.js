module.exports = function(RED) {
  function BlockchainConfigNode(config) {
      RED.nodes.createNode(this, config);
      this.network = config.network;
      this.privatekey = config.privatekey;
  }
  RED.nodes.registerType('blockchain-config', BlockchainConfigNode);
};