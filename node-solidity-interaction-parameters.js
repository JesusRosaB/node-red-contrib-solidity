/*
  ***************************************************************
  *  node-red-contrib-solidity                                  *
  *  Jesús Rosa Bilbao (jesus.rosa@uca.es) &                    *
  *  Juan Boubeta Puig (juan.boubeta@uca.es)                    *
  *  University of Cadiz                                        *
  *                                                             *
  ***************************************************************
*/
const Web3 = require("web3");

module.exports = function(RED) {

  RED.nodes.registerType('solidity-interaction-parameters', SolidityInteractionParameters);

  function SolidityInteractionParameters(config){
    RED.nodes.createNode(this, config);

    let node = this;

    try {
        var solidityConfig = RED.nodes.getNode(config.config);
        var smartContractConfig = RED.nodes.getNode(config.smartcontract);
        
        const privateKey = solidityConfig.privatekey;  
        const networkUrlAPI = solidityConfig.network;

        const web3 = new Web3(networkUrlAPI);

        const address = web3.eth.accounts.privateKeyToAccount(privateKey).address;
        const abi = JSON.parse(smartContractConfig.abi);
        const scaddress = smartContractConfig.scaddress;  

        if(config.parametersList.length == 0){
            var txstring = 'myContract.methods.'+ config.scnamefunction + '()';
        } else if (config.parametersList.length == 1){
            var txstring = 'myContract.methods.'+ config.scnamefunction + '(' + config.parametersList[0].value + ')';
        } else {
            var txstring = 'myContract.methods.' + config.scnamefunction + '(';

            for(var i = 0; i < config.parametersList.length - 1; i++){
                txstring = txstring + config.parametersList[i].value + ', ';
            }

            txstring = txstring + config.parametersList[config.parametersList.length - 1].value + ')';
        }

        try {
            setTimeout(async () => {
                    
                const networkId = await web3.eth.net.getId();
                const myContract = new web3.eth.Contract(
                    abi,
                    scaddress
                );

                if(config.ispurefunction) {
                    txstring = txstring + '.call()';
                    try {
                        const tx = await eval(txstring);
                        var msg = {payload: tx};
                    } catch(error) {
                        console.error(error);
                    }
                } else {
                    const tx = eval(txstring);
                
                    const gas = await tx.estimateGas({from: address});
                    const gasPrice = Math.round(await web3.eth.getGasPrice() * 1.101);
                    const data = tx.encodeABI();

                    try {
                        const signedTx = await web3.eth.accounts.signTransaction(
                        {
                            to: myContract.options.address, 
                            data,
                            gas,
                            gasPrice,
                            chainId: networkId
                        },
                            privateKey
                        );
                        
                        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

                        var msg = {payload: receipt};
                    } catch(error) {
                        console.error(error);
                    }
                }   

                node.send(msg);
            })
        } catch(e) {
            node.error(e);
        }

    } catch(error) {
        console.error(error);
    } 

  }
}