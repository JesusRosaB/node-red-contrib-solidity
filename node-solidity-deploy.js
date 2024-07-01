/*
  ***************************************************************
  *  node-red-contrib-solidity                                  *
  *  Jesús Rosa Bilbao (jesus.rosa@uca.es) &                    *
  *  Juan Boubeta Puig (juan.boubeta@uca.es)                    *
  *  University of Cadiz                                        *
  *                                                             *
  ***************************************************************
*/
var Web3 = require('web3');

module.exports = function(RED) {

  RED.nodes.registerType('solidity-deploy', DeploySolidity);

  function DeploySolidity(config){
    RED.nodes.createNode(this, config);

    let node = this;
   
   try {
    setTimeout(async () => {
      var solidityConfig = RED.nodes.getNode(config.config);
      var smartContractConfig = RED.nodes.getNode(config.smartcontract);

      const privateKey = solidityConfig.privatekey;  
      const networkUrlAPI = solidityConfig.network;
    
      const web3 = new Web3(networkUrlAPI);
    
      const publicaddress = web3.eth.accounts.privateKeyToAccount(privateKey).address;
      
      const account_from = {
         privateKey: privateKey,
         address: publicaddress,
      };

      const bytecode = smartContractConfig.bytecode;
      const abi = JSON.parse(smartContractConfig.abi);

      let parameters = [];

      for(var i = 0; i < config.parametersList.length; i++){
         parameters.push(config.parametersList[i].value);
      }

       var msg = {payload: `Attempting to deploy from account ${account_from.address}`};
       node.send(msg);

       const incrementer = new web3.eth.Contract(abi);

       const incrementerTx = incrementer.deploy({
          data: bytecode,
          arguments: parameters,
       });

       const createTransaction = await web3.eth.accounts.signTransaction(
          {
             data: incrementerTx.encodeABI(),
             gas: await incrementerTx.estimateGas(),
          },
          account_from.privateKey
       );

       const createReceipt = await web3.eth.sendSignedTransaction(
          createTransaction.rawTransaction
       );
       
       let contractData = {
         address: createReceipt.contractAddress
       }; 

       msg.payload = contractData;
       node.send(msg);
    });
   }
   catch(e) {
     node.error(e);
   }
  }
}