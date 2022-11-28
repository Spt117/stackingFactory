import { useEth } from "../Context"
import { ethers } from "ethers"
import { useState, useEffect } from "react"
import MyPools from "./MyPools"

export default function SupplyPool() {
    const {
        state: { account, provider, createPool, IERC20Abi, stackingAbi },
    } = useEth()
    const [pool, setPool] = useState([])

    useEffect(() => {
        if (createPool) {
            getContract()
            eventNewPool()
        }
        // eslint-disable-next-line
    }, [account, provider, createPool])

    async function getContract() {
        let pools = []
        const events = await createPool.queryFilter("newPool", 0, "latest")
        for (let event of events) {
            let name, decimals, symbol, supply
            const contrat = event.args.contrat
            const stacking = new ethers.Contract(contrat, stackingAbi, provider)
            const aboutPool = await stacking.getMyPool()
            if (event.args.owner === account) {
                const ierc20 = new ethers.Contract(aboutPool[0], IERC20Abi, provider)
                try {
                    name = await ierc20.name()
                } catch {
                    name = null
                }
                try {
                    decimals = await ierc20.decimals()
                } catch {
                    decimals = null
                }
                try {
                    symbol = await ierc20.symbol()
                } catch {
                    symbol = null
                }
                supply = (aboutPool[4] / 10 ** decimals).toString()
                pools.push({ addressPool: contrat, name: name, symbol: symbol, decimals: decimals, addressToken: aboutPool[0], supply: supply })
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
