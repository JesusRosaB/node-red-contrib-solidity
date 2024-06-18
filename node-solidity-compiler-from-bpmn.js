const compiler = require('bpmn-sol');

module.exports = function(RED) {

  RED.nodes.registerType('solidity-compiler-from-bpmn', CompileBpmnToSolidity);

  function CompileBpmnToSolidity(config){
    RED.nodes.createNode(this, config);

    let node = this;

    try {
        this.on("input", function(msg) {

            const xml = {
               bpmn: msg.payload,
               name: config.scname
            }

            const contract = compiler.compile(xml).then(contract => {
               msg.payload = contract;
            });

            node.send(msg);            
        })
    } catch(e) {
        node.error(e);
    }
  }
}