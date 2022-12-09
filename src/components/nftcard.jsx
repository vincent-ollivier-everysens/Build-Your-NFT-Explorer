const NftCard = ({ image, id, emitter, metadata }) => {


    return (
        <div className="w-1/4 mr-3 mb-4 bg-slate-100 rounded-md" >
            <img className='w-24 rounded-t-md' key={id} src={image}></img>
            <div className="p-3">
                <div className="flex mb-3">
                    <div className="flex-grow">
                        <h3 className="text-xl">tokenId: {id}</h3>
                    </div>
                </div>
                <h1>Emitter: {emitter? emitter.slice(0, 32) : "No Emitter"}</h1>
                <p>C02: {metadata.GGE.CO2.computation.result.sign}{metadata.GGE.CO2.computation.result.value} {metadata.GGE.CO2.computation.result.unit}</p>
                <br/>
                <p>date from : {metadata.GGE.CO2.computation.dates.from}</p>
                <p>date to : {metadata.GGE.CO2.computation.dates.to}</p>

            </div>

        </div>
    )
}

export default NftCard