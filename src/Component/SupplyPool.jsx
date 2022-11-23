import { useEth } from "../Context"
import { ethers } from "ethers"
import { useState, useEffect } from "react"

export default function SupplyPool() {
    const {
        state: { account, provider, signer, createPool, IERC20Abi, stackingAbi },
    } = useEth()
    const [loader, setLoader] = useState(false)
    const [amount, setAmount] = useState(0)
    const [pool, setPool] = useState([])

    useEffect(() => {
        if (createPool) {
            getContract()
            eventNewPool()
        }
        // eslint-disable-next-line
    }, [account, provider, signer, createPool, amount])

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

    async function supplyPool(contrat) {
        const stacking = new ethers.Contract(contrat, stackingAbi, signer)
        setLoader(true)
        try {
            const token = await stacking.token()
            const ierc20 = new ethers.Contract(token, IERC20Abi, signer)
            const approuval = await ierc20.approve(contrat, amount)
            await approuval.wait()
            const transaction = await stacking.supplyContract(amount)
            await transaction.wait()
        } catch (err) {
            console.log(err)
        } finally {
            setLoader(false)
        }
    }

    function eventNewPool() {
        createPool.on("newPool", (pool, owner) => {
            getContract()
        })
    }

    return (
        <div>
            <h2>Pools</h2>
            <div className="parentPool">
                {pool.map((contrat, index) => (
                    <div className="pools" key={index}>
                        <p>{contrat.name}</p>
                        <p>{contrat.symbol}</p>
                        <p>{contrat.addressPool}</p>
                        <h5>Alimentez votre pool en rewards</h5>
                        <input placeholder="Nombre de tokens" type="number" onChange={(e) => setAmount(e.target.value * 10 ** contrat.decimals)} />
                        <button onClick={() => supplyPool(contrat.addressPool)}>OK</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
