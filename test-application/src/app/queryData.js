const { Gateway, Wallets, } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('doc-network');
const util = require('util')
const helper = require('./bchelper')
const queryChain = async (channelName, chaincodeName, args, fcn, username, org_name) => {

    try {

        
        logger.debug("queryChain:: start",fcn,args, username,org_name)
        const ccp = await helper.getCCP(org_name) //JSON.parse(ccpJSON);
        console.log("after====orgname",org_name)
        // Create a new file system based wallet for managing identities.
        const walletPath = await helper.getWalletPath(org_name) //.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true }
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);
        let result;

        switch (fcn) {
            case "readDigitalDocument":
                try{

                result = await contract.evaluateTransaction(fcn, args[0]);

                }catch(error){

                    result = await contract.evaluateTransaction("readDigitalDocumentByTxId", args[0]);
                }
                break;
            case "GetHistoryForAsset":
            case "readDigitalDocumentByTxId":
                console.log("=============")
                result = await contract.evaluateTransaction(fcn, args[0]);
                break;
                case "digitaldocumentExists":
                    console.log("=============")
                    result = await contract.evaluateTransaction(fcn, args[0]);
                    break;
            default:
                break;
        }

        console.log(result)
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        result = JSON.parse(result.toString());
        return result
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return error.message

    }
}

exports.queryChain = queryChain