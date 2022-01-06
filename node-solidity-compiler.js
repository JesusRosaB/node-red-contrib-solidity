const solc = require('solc');

module.exports = function(RED) {

  RED.nodes.registerType('solidity-compiler', CompileSolidity);

  function CompileSolidity(config){
    RED.nodes.createNode(this, config);

    let node = this;

    try {
        this.on("input", function(msg) {

            var solidityCode = msg.payload;

            solidityCode = "// SPDX-License-Identifier: " + config.licenseidentifier + "\n" + config.pragmasolidity + "; \n" + solidityCode;
            
            regexpr = /contract +\w+/g;

            var contractname = solidityCode.match(regexpr)[0];

            contractname = contractname.substring(8).trim();

            const input = {
               language: 'Solidity',
               sources: {
                  'SmartContracts': {
                     content: solidityCode.toString(),
                  },
               },
               settings: {
                  outputSelection: {
                     '*': {
                        '*': ['*'],
                     },
                  },
               },
            };

            const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));

            if(tempFile.contracts) {
               const contractFile = tempFile.contracts['SmartContracts'][contractname];
               msg.payload = contractFile;
               node.send(msg);
            } else {
               msg.payload = tempFile;
               node.send(msg);
            }            
        })
    } catch(e) {
        node.error(e);
    }
  }
}