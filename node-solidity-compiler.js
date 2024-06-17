const solc = require('solc');

module.exports = function(RED) {

  RED.nodes.registerType('solidity-compiler', CompileSolidity);

  function CompileSolidity(config){
    RED.nodes.createNode(this, config);

    let node = this;

    try {
      this.on("input", function(msg) {

        var solidityCode = msg.payload;
        
        let licenseMatch = solidityCode.match(/\/\/\s*SPDX-License-Identifier:\s*([^\s]+)/);
        let licenseIdentifier = licenseMatch ? licenseMatch[1] : config.licenseidentifier || "UNLICENSED";

        let pragmaMatch = solidityCode.match(/pragma\s+solidity\s+([^;]+);/);
        let pragmaSolidity = pragmaMatch ? pragmaMatch[0] : `pragma solidity ${config.pragmasolidity || "^0.8.0"};`;

        solidityCode = `// SPDX-License-Identifier: ${licenseIdentifier}\n${pragmaSolidity}\n${solidityCode}`;

        let regexpr = /contract +\w+/g;
        let contractNameMatch = solidityCode.match(regexpr);
        
        if (!contractNameMatch) {
          node.error("No se encontró el nombre del contrato en el código Solidity.");
          return;
        }

        var contractName = contractNameMatch[0].substring(8).trim();

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

         if (tempFile.contracts) {
          const contractFile = tempFile.contracts['SmartContracts'][contractName];
            
          let contractData = {
            bytecode: contractFile.evm.bytecode.object,
            abi: contractFile.abi
          }; 

          msg.payload = contractData;
          node.send(msg);
        } else {
          msg.payload = tempFile;
          node.send(msg);
        }            
      });
    } catch(e) {
      node.error(e);
    }
  }
}
