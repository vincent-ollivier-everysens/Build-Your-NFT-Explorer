const NftCard = ({ image, id, emitter, metadata, dates }) => {


    return (
        <div className="w-1/4 mr-3 mb-4 bg-slate-100 rounded-md" >
            <img className='w-24 rounded-t-md' key={id} src={image}></img>
            <div className="p-3">
                <div className="flex mb-3">
                    <div className="flex-grow">
                        <h3 className="text-xl">tokenId: {id}</h3>
                    </div>
                </div>
                <ul>
                    <li><span className="nft-attr">Emitter:</span> <span className="nft-attr-value">{emitter? emitter.slice(0, 32) : "No Emitter"}</span></li>
                    <li><span className="nft-attr">Description:</span> <span className="nft-attr-value">{metadata.GGE.emitter.description.slice(0, 32)}</span></li>
                    <li><span className="nft-attr">C02:</span><span className="nft-attr-value"> <b>{metadata.GGE.CO2.computation.result.value}</b> <i>({metadata.GGE.CO2.computation.result.unit})</i></span></li>
                    <li><span className="nft-attr">date from:</span> <span className="nft-attr-date">{dates.from}</span></li>
                    <li><span className="nft-attr">date to:</span> <span className="nft-attr-date">{dates.to}</span></li>
                </ul>


            </div>

        </div>
    )
}

export default NftCard