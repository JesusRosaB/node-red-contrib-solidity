module.exports = function(RED) {
  function SmartContractConfigNode(n) {
      RED.nodes.createNode(this,n);
      this.name = n.name;
      this.bytecode = n.bytecode;
      this.abi = n.abi;
      this.scaddress = n.scaddress;
  }
  RED.nodes.registerType("smartcontract-config",SmartContractConfigNode);
}