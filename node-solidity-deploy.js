var Web3 = require('web3');

// --------------------------------------------------------------------------
//  NODE-RED
// --------------------------------------------------------------------------

module.exports = function(RED) {

  RED.nodes.registerType('solidity-deploy', DeploySolidity);

  function DeploySolidity(config){
    RED.nodes.createNode(this, config);

    let node = this;

   setTimeout(async () => {

      var networkUrlAPI = "";

      switch(config.network){
         case "ethereum(mainnet)":
            networkUrlAPI = "wss://speedy-nodes-nyc.moralis.io/a5dfa04eb13b97d8a8650899/eth/mainnet/ws";
            break;
         case "ethereum(ropsten)":
            networkUrlAPI = "wss://speedy-nodes-nyc.moralis.io/a5dfa04eb13b97d8a8650899/eth/ropsten/ws";
            break;
         case "ethereum(goerli)":
            networkUrlAPI = "wss://speedy-nodes-nyc.moralis.io/a5dfa04eb13b97d8a8650899/eth/goerli/ws";
            break;
         case "ethereum(rinkeby)":
            networkUrlAPI = "wss://speedy-nodes-nyc.moralis.io/a5dfa04eb13b97d8a8650899/eth/rinkeby/ws";
            break;
         case "ethereum(kovan)":
            networkUrlAPI = "wss://speedy-nodes-nyc.moralis.io/a5dfa04eb13b97d8a8650899/eth/kovan/ws";
            break;
         case "bsc(mainnet)":
            networkUrlAPI = "wss://speedy-nodes-nyc.moralis.io/a5dfa04eb13b97d8a8650899/bsc/mainnet/archive/ws";
            break;
         case "bsc(testnet)":
            networkUrlAPI = "wss://speedy-nodes-nyc.moralis.io/a5dfa04eb13b97d8a8650899/bsc/testnet/ws";
            break;
         case "polygon(mainnet)":
            networkUrlAPI = "wss://speedy-nodes-nyc.moralis.io/a5dfa04eb13b97d8a8650899/polygon/mainnet/ws";
            break;
         case "polygon(mumbai)":
            networkUrlAPI = "wss://speedy-nodes-nyc.moralis.io/a5dfa04eb13b97d8a8650899/polygon/mumbai/ws";
            break;
      }
    
      const web3 = new Web3(networkUrlAPI);
    
      const privateKey = config.privatekey;   
      const publicaddress = web3.eth.accounts.privateKeyToAccount(privateKey).address;
      
      const account_from = {
         privateKey: privateKey,
         address: publicaddress,
      };

      const bytecode = config.bytecode;
      const abi = JSON.parse(config.abi);

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
       
       msg.payload = `Contract deployed at address: ${createReceipt.contractAddress}`;
       node.send(msg);
    });
  }
}