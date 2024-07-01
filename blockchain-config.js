/*
  ***************************************************************
  *  node-red-contrib-solidity                                  *
  *  Jesús Rosa Bilbao (jesus.rosa@uca.es) &                    *
  *  Juan Boubeta Puig (juan.boubeta@uca.es)                    *
  *  University of Cadiz                                        *
  *                                                             *
  ***************************************************************
*/
module.exports = function(RED) {
  function BlockchainConfigNode(config) {
      RED.nodes.createNode(this, config);
      this.network = config.network;
      this.privatekey = config.privatekey;
  }
  RED.nodes.registerType('blockchain-config', BlockchainConfigNode);
};