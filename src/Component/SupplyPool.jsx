import { useEth } from "../Context"
import { ethers } from "ethers"
import { useState, useEffect } from "react"
import MyPools from "./MyPools"

export default function SupplyPool() {
    const {
        state: { account, provider, signer, createPool, IERC20Abi, stackingAbi },
    } = useEth()
    const [pool, setPool] = useState([])

    useEffect(() => {
        if (createPool) {
            getContract()
            eventNewPool()
        }
        // eslint-disable-next-line
    }, [account, provider, signer, createPool])

    async function getContract() {
        let pools = []
        const events = await createPool.queryFilter("newPool", 0, "latest")
        for (let event of events) {
            if (event.args.owner === account) {
                const contrat = event.args.contrat
                const stacking = new ethers.Contract(contrat, stackingAbi, signer)
                const token = await stacking.token()
                const ierc20 = new ethers.Contract(token, IERC20Abi, signer)
                const name = await ierc20.name()
                const decimals = await ierc20.decimals()
                const symbol = await ierc20.symbol()
                pools.push({ addressPool: contrat, name: name, symbol: symbol, decimals: decimals, addressToken: token })
            }
        }
        setPool(pools)
    }

    function eventNewPool() {
        createPool.on("newPool", (pool, owner) => {
            getContract()
        })
    }

    if (pool.length > 0)
        return (
            <div>
                <h2>Pools</h2>
                <div className="parentPool">
                    {pool.map((contrat, index) => (
                        <div key={index} className="pools">
                            <MyPools contrat={contrat} />
                        </div>
                    ))}
                </div>
            </div>
        )
}
