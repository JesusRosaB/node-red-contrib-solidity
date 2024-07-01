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

  RED.nodes.registerType('solidity-interaction', SolidityInteraction);

  function SolidityInteraction(config){
    RED.nodes.createNode(this, config);

    let node = this;

    try {
        var solidityConfig = RED.nodes.getNode(config.config);
        var smartContractConfig = RED.nodes.getNode(config.smartcontract);
        
        const privateKey = solidityConfig.privatekey;  
        const networkUrlAPI = solidityConfig.config.network;

        const web3 = new Web3(networkUrlAPI);

        const address = web3.eth.accounts.privateKeyToAccount(privateKey).address;
        const abi = JSON.parse(smartContractConfig.abi);
        const scaddress = smartContractConfig.scaddress;  

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

                    if(config.ispurefunction) {
                        txstring = txstring + '.call()';
                        try {
                            const tx = await eval(txstring);
                            msg.payload = tx;
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

                            msg.payload = receipt;
                        } catch(error) {
                            console.error(error);
                        }
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