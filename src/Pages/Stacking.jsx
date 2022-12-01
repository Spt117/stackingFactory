import { useState, useEffect } from "react"
import { useEth } from "../Context"
import { ethers } from "ethers"
import PoolStacking from "../Component/PoolStacking"

export default function Stacking() {
    const {
        state: { createPool, stackingAbi, IERC20Abi, provider },
    } = useEth()
    const [pool, setPool] = useState([])
    const today = new Date().getTime()

    useEffect(() => {
        if (createPool) getPools()
        // eslint-disable-next-line
    }, [createPool])

    async function getPools() {
        let pools = []
        const length = await createPool.getLength()
        for (let i = 0; i < length; i++) {
            let address = await createPool.Contracts(i)
            const pool = new ethers.Contract(address, stackingAbi, provider)
            const aboutPool = await pool.getMyPool()
            const ierc20 = new ethers.Contract(aboutPool[0], IERC20Abi, provider)
            let name, decimals, symbol, supplyRewards

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
            supplyRewards = (aboutPool[4] / 10 ** decimals).toString()

            if (supplyRewards > 0) {
                pools.push({ addressPool: address, name: name, symbol: symbol, decimals: decimals, addressToken: aboutPool[0], supplyRewards: supplyRewards, about: aboutPool })
            }
        }
        setPool(pools)
    }

    return (
        <div>
            <h2>Pools</h2>
            {pool.length > 0 && (
                <div className="parentPool">
                    {pool.map((contrat, index) => (
                        <div key={index} className="pools">
                            <PoolStacking contrat={contrat} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
