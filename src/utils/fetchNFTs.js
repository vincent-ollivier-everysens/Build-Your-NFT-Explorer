// Go to www.alchemy.com and create an account to grab your own api key!


import {BigNumber} from "@ethersproject/bignumber";

const apiKey = "VkuC8BKyXlr9QZAPu3s6tWmH7ua0a0tA";
const endpoint = `https://eth-goerli.g.alchemy.com/v2/${apiKey}`;
//const endpoint = `http://localhost:8545`;


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
        console.log(data);
        fromJson = data.attributes[0];
    }).catch(error => {
        console.error(error);
    });

    await Promise.resolve(p);


    n._cleaned = {
        tokenId        : tokenId,
        tokenUri       : n.tokenUri.raw,
        gatewayJsonUrl : jsonUrl,
        gatewayPngUrl  : pngUrl,
        metadata       : fromJson
    }

    return n;
}


export const fetchNFTs = async (owner, contractAddress, setNFTs, retryAttempt) => {

    owner = '0x3c794EB9E0ADcF7DE31973c5A824b940B6738E81';
    contractAddress = '0x0B7f1f4aB84601343f3BcBAFD21df888b082922d';

    if (retryAttempt === 5) {
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
        data.ownedNfts = data.ownedNfts.slice(3);

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
