
import {BigNumber} from "@ethersproject/bignumber";
const openpgp = require('openpgp');
const {Base64} = require("js-base64");

const apiKey = "VkuC8BKyXlr9QZAPu3s6tWmH7ua0a0tA";
const endpoint = `https://eth-goerli.g.alchemy.com/v2/${apiKey}`;
const decryptMasterPassphrase = "39b8bd861f914708dec0fc1311d4dd782391caf261e2eaebbcc3301e5ffc0689"


async function decrypt(encryptedStringBase64, passphrase)
{
    const encryptedUint8Array = Base64.toUint8Array(encryptedStringBase64);
    const encryptedMessage = await openpgp.readMessage({ binaryMessage: encryptedUint8Array });
    const { data: decrypted } = await openpgp.decrypt({
        message: encryptedMessage,
        passwords: [passphrase],
        format: 'text'
    });
    return decrypted;
}


async function gpg_decrypt_object(object, passphrase) {
    let promises = [];
    Object.keys(object).map((n) => {
        promises.push(decrypt(object[n], passphrase).then((ec) => {
            object[n] = ec;
        }));
    });
    return Promise.all(promises).then(() => { return object; });
}




async function clean(n)
{
    const getJSON = async url => {
        const response = await fetch(url);
        if(!response.ok) // check if response worked (no 404 errors etc...)
            throw new Error(response.statusText);
        const data = response.json(); // get JSON from the response
        return data; // returns a promise, which resolves to this data value
    }


    const tokenId = BigNumber.from(n.id.tokenId).toNumber()
    const cid = n.tokenUri.raw.replace("ipfs://","");
    const jsonUrl = "https://nftstorage.link/ipfs/".concat(cid).concat(`/${tokenId}.json`);
    const pngUrl  = "https://nftstorage.link/ipfs/".concat(cid).concat(`/${tokenId}.png`);
    let   fromJson = null;

    let p = getJSON(jsonUrl).then(data => {
        fromJson = data;
    }).catch(error => {
        console.error(error);
    });

    await Promise.resolve(p);
    const passphrase = await decrypt(fromJson.passphrase, decryptMasterPassphrase); // encrypt the local passphrase with master passphrase

    let emitter = fromJson.attributes[0].GGE.emitter;
    emitter = await gpg_decrypt_object(emitter, passphrase);

    //console.log("emitter:");
    //console.log(emitter);

    n._cleaned = {
        tokenId        : tokenId,
        tokenUri       : n.tokenUri.raw,
        gatewayJsonUrl : jsonUrl,
        gatewayPngUrl  : pngUrl,
        metadata       : fromJson.attributes[0]
    }

    return n;
}


export const fetchNFTs = async (owner, contractAddress, setNFTs, retryAttempt) => {

    owner = '0x3c794EB9E0ADcF7DE31973c5A824b940B6738E81';
    contractAddress = '0x2fA22Dd0Eb16A72B7a9499A84C07c3040c183677';

    if (retryAttempt === 3) {
        return;
    }
    if (owner) {
        let data;
        try {
            if (contractAddress) {
                data = await fetch(`${endpoint}/getNFTs?owner=${owner}&contractAddresses%5B%5D=${contractAddress}`).then(data => data.json())
            } else {
                data = await fetch(`${endpoint}/getNFTs?owner=${owner}`).then(data => data.json())
            }
        } catch (e) {
            fetchNFTs(endpoint, owner, contractAddress, setNFTs, retryAttempt+1)
        }

        //console.log(data);
        //data.ownedNfts = data.ownedNfts.slice(1);

        const promises = data.ownedNfts.map(n => clean(n));
        const R = await Promise.all(promises);
        console.log(R);

        setNFTs(R);
        return data
    }
}


export const getGasPrice = async () => {

/*
    // Optional config object, but defaults to demo api-key and eth-mainnet.
    const settings = {
        apiKey: apiKey, // Replace with your Alchemy API Key.
        network: Network.ETH_MAINNET, // Replace with your network.
    };
    const alchemy = new Alchemy(settings);

    return alchemy.core.getGasPrice().then(console.log);
*/
    return 1;
}
