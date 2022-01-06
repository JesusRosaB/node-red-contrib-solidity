const Web3 = require("web3");

module.exports = function(RED) {

  RED.nodes.registerType('solidity-interaction', SolidityInteraction);

  function SolidityInteraction(config){
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

        try {
            this.on("input", function(msg) {
                setTimeout(async () => {
                    
                    const networkId = await web3.eth.net.getId();
                    const myContract = new web3.eth.Contract(
                        abi,
                        scaddress
                    );

                    const JSONdata = JSON.parse(msg.payload);
                    
                    if(JSONdata.length == 0){
                        var txstring = 'myContract.methods.'+ config.scnamefunction + '()';
                    } else if (JSONdata.length == 1){
                        var txstring = 'myContract.methods.'+ config.scnamefunction + '(' + JSONdata[0].value + ')';
                    } else {
                        var txstring = 'myContract.methods.' + config.scnamefunction + '(';
            
                        for(var i = 0; i < JSONdata.length - 1; i++){
                            txstring = txstring + JSONdata[i].value + ', ';
                        }
            
                        txstring = txstring + JSONdata[JSONdata.length - 1].value + ')';
                    }

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

                        msg.payload = receipt;
                    } catch(error) {
                        console.error(error);
                    }

                    node.send(msg);
                })
            })
        } catch(e) {
            node.error(e);
        }

    } catch(error) {
        console.error(error);
    } 

  }
}