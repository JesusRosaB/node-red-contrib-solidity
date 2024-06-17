node-red-contrib-solidity
===================

node-red-contrib-solidity is a package that bundles a set of Node-RED nodes that can be used to perform solidity operations

Currently, there are five nodes implemented:

 - node-solidity-compiler: compilation process of the solidity code
 - node-solidity-compiler-from-bpmn: compilation process from bpmn code to solidity code
 - node-solidity-deploy: deployment process of the solidity code
 - node-solidity-interaction: interaction process with a smart contract already deployed in a blockchain network
 - node-solidity-interaction-parameter: interaction process with a smart contract already deployed in a blockchain network by specifying the parameters in the node itself

Installation
------
To install the package, just run the following command in your Node-RED user directory (normally `~/.node-red`):

    git clone https://github.com/JesusRosaB/node-red-contrib-solidity.git
    
    npm install node-red-contrib-solidity

Usage
------
Just like any Node-RED node, simply drag the desired node and drop it on the main canvas/flow. However, as a requirement, each msg containing the input data to the nodes in this package must be in `msg.payload`. In addition, all results generated as a consequence of using these nodes will also be found in the msg object, concretely, in `msg.payload`.

Examples
------
Below, you can find several simple examples (JSON code of flows). To use it, you just need to import the streams into node-red. These examples are a basic implementation of the nodes presented in this package to see their operation and requirements.

    [{"id":"f6f2187d.f17ca8","type":"tab","label":"Solidity compilation flow","disabled":false,"info":""},{"id":"c6050446.7be55","type":"inject","z":"f6f2187d.f17ca8","name":"","props":[{"p":"payload"}],"repeat":"","crontab":"","once":true,"onceDelay":0.1,"topic":"","payload":"contract Storage { uint256 number;    function store(uint256 num) public {        number = num;    }    function retrieve() public view returns (uint256){        return number;    }}","payloadType":"str","x":390,"y":220,"wires":[["3544a7aa.87a66"]]},{"id":"dc5c0dd2.fb4368","type":"debug","z":"f6f2187d.f17ca8","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":970,"y":220,"wires":[]},{"id":"3544a7aa.87a66","type":"solidity-compiler","z":"f6f2187d.f17ca8","name":"","x":680,"y":220,"wires":[["dc5c0dd2.fb4368"]]}]

<b><i><sup>Solidity compilation flow example</sup></i></b>

    [{"id":"dee25cc01a3772c9","type":"tab","label":"Solidity deployment flow","disabled":false,"info":""},{"id":"85c9d6ec3030b2dd","type":"smartcontract-config","name":"Storage","bytecode":"6080604052348015600e575f80fd5b506101438061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80632e64cec1146100385780636057361d14610056575b5f80fd5b610040610072565b60405161004d919061009b565b60405180910390f35b610070600480360381019061006b91906100e2565b61007a565b005b5f8054905090565b805f8190555050565b5f819050919050565b61009581610083565b82525050565b5f6020820190506100ae5f83018461008c565b92915050565b5f80fd5b6100c181610083565b81146100cb575f80fd5b50565b5f813590506100dc816100b8565b92915050565b5f602082840312156100f7576100f66100b4565b5b5f610104848285016100ce565b9150509291505056fea26469706673582212204e7814d536e8d27a66caa4b21d2184bb401ae1858294ceeeceaac1080f84f45f64736f6c634300081a0033","abi":"[{\"inputs\":[],\"name\":\"retrieve\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"num\",\"type\":\"uint256\"}],\"name\":\"store\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]","scaddress":""},{"id":"6318be4cc8cce212","type":"solidity-deploy","z":"dee25cc01a3772c9","name":"","config":"","smartcontract":"85c9d6ec3030b2dd","parametersList":[],"x":550,"y":240,"wires":[["03743034d24bcd73"]]},{"id":"03743034d24bcd73","type":"debug","z":"dee25cc01a3772c9","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":880,"y":240,"wires":[]}]
    
<b><i><sup>Solidity deployment flow example</sup></i></b>

    [{"id":"09669cfa67103161","type":"tab","label":"Solidity interaction flow","disabled":false,"info":""},{"id":"85c9d6ec3030b2dd","type":"smartcontract-config","name":"Storage","bytecode":"6080604052348015600e575f80fd5b506101438061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80632e64cec1146100385780636057361d14610056575b5f80fd5b610040610072565b60405161004d919061009b565b60405180910390f35b610070600480360381019061006b91906100e2565b61007a565b005b5f8054905090565b805f8190555050565b5f819050919050565b61009581610083565b82525050565b5f6020820190506100ae5f83018461008c565b92915050565b5f80fd5b6100c181610083565b81146100cb575f80fd5b50565b5f813590506100dc816100b8565b92915050565b5f602082840312156100f7576100f66100b4565b5b5f610104848285016100ce565b9150509291505056fea26469706673582212204e7814d536e8d27a66caa4b21d2184bb401ae1858294ceeeceaac1080f84f45f64736f6c634300081a0033","abi":"[{\"inputs\":[],\"name\":\"retrieve\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"num\",\"type\":\"uint256\"}],\"name\":\"store\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]","scaddress":""},{"id":"a8a10ad7e16b0328","type":"inject","z":"09669cfa67103161","name":"","props":[{"p":"payload"}],"repeat":"","crontab":"","once":true,"onceDelay":0.1,"topic":"","payload":"[ { \"value\": 123 } ]","payloadType":"str","x":470,"y":260,"wires":[["1664219ff9672a55"]]},{"id":"815ce91101a82908","type":"debug","z":"09669cfa67103161","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":1030,"y":260,"wires":[]},{"id":"1664219ff9672a55","type":"solidity-interaction","z":"09669cfa67103161","name":"","config":"","smartcontract":"","scnamefunction":"store","ispurefunction":false,"x":750,"y":260,"wires":[["815ce91101a82908"]]}]

<b><i><sup>Solidity interaction flow example</sup></i></b>

    [{"id":"f6f2187d.f17ca8","type":"tab","label":"Solidity interaction with parameters flow","disabled":false,"info":""},{"id":"85c9d6ec3030b2dd","type":"smartcontract-config","name":"Storage","bytecode":"6080604052348015600e575f80fd5b506101438061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80632e64cec1146100385780636057361d14610056575b5f80fd5b610040610072565b60405161004d919061009b565b60405180910390f35b610070600480360381019061006b91906100e2565b61007a565b005b5f8054905090565b805f8190555050565b5f819050919050565b61009581610083565b82525050565b5f6020820190506100ae5f83018461008c565b92915050565b5f80fd5b6100c181610083565b81146100cb575f80fd5b50565b5f813590506100dc816100b8565b92915050565b5f602082840312156100f7576100f66100b4565b5b5f610104848285016100ce565b9150509291505056fea26469706673582212204e7814d536e8d27a66caa4b21d2184bb401ae1858294ceeeceaac1080f84f45f64736f6c634300081a0033","abi":"[{\"inputs\":[],\"name\":\"retrieve\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"num\",\"type\":\"uint256\"}],\"name\":\"store\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]","scaddress":""},{"id":"d99656b6.50cfd","type":"solidity-interaction-parameters","z":"f6f2187d.f17ca8","name":"","config":"","smartcontract":"85c9d6ec3030b2dd","scnamefunction":"store","ispurefunction":false,"parametersList":[{"value":"123"}],"x":580,"y":260,"wires":[["dccacabd.9f5458"]]},{"id":"dccacabd.9f5458","type":"debug","z":"f6f2187d.f17ca8","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","statusVal":"","statusType":"auto","x":960,"y":260,"wires":[]}]

<b><i><sup>Solidity interaction with parameters flow example</sup></i></b>

License
------
node-red-contrib-solidity is available under the MIT license. See the [LICENSE](https://github.com/JesusRosaB/node-red-contrib-solidity/blob/main/LICENSE) file for more info.