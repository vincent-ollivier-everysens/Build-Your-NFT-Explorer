
import { useState } from 'react';
import NftCard from '../components/nftcard';
import {fetchNFTs} from '../utils/fetchNFTs';

const Explore = () => {

    const [owner, setOwner] = useState("")
    const [contractAddress, setContractAddress] = useState("")
    const [NFTs, setNFTs] = useState("")
    

    return (
        <div>
            <header className=' py-24  mb-12 w-full   alchemy'>
                <div className='flex flex-col items-center '>
                    <div className='text-white text-center'>
                        <h1 className='text-4xl  font-bold font-body mb-2'>
                            Everysens NFT Explorer
                        </h1>
                    </div>
                    {/*
                    <div className='flex flex-col items-center justify-center mb-4 w-2/6 gap-y-2 '>
                        <input className="border rounded-sm focus:outline-none py-2 px-3 w-full" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder='Insert your wallet address'></input>
                        <input className="focus:outline-none rounded-sm py-2 px-3 w-full" value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} placeholder='Insert NFT Contract address (optional)'></input>
                    </div>
                    */}
                    <div className='w-2/6 flex justify-center'>
                    <button className='py-2 bg-white rounded-sm w-full hover:bg-slate-100' onClick={() => {fetchNFTs(owner, contractAddress, setNFTs    )}}>Refresh</button>
                    </div>
                </div>
            </header>

            <section className='flex flex-wrap justify-center'>
                {
                    NFTs ? NFTs.map(NFT => {

                        return (
                           <NftCard image={NFT._cleaned.gatewayPngUrl} id={NFT._cleaned.tokenId }  emitter={NFT._cleaned.metadata.GGE.emitter.name} metadata={NFT._cleaned.metadata} ></NftCard>
                        )
                    }) : <div>No NFTs found</div>
                }
            </section>
        </div>
    )
}


export default Explore