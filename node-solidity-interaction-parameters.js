const Web3 = require("web3");

// --------------------------------------------------------------------------
//  NODE-RED
// --------------------------------------------------------------------------

module.exports = function(RED) {

  RED.nodes.registerType('solidity-interaction-parameters', SolidityInteractionParameters);

  function SolidityInteractionParameters(config){
    RED.nodes.createNode(this, config);

    let node = this;

    try {
        const privateKey = config.privatekey;    
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

        const address = web3.eth.accounts.privateKeyToAccount(privateKey).address;
        const abi = JSON.parse(config.abi);
        const scaddress = config.scaddress;  

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
                    const gasPrice = await web3.eth.getGasPrice();
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