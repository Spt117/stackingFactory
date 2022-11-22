import StackingFactory from "../artifacts/contracts/StackingFactory.sol/StackingFactory.json"
import { useEth } from "../Context"
import { useState } from "react"
import { ethers } from "ethers"

export default function AddPool() {
    const {
        state: { provider, networkID },
    } = useEth()
    const [loader, setLoader] = useState(false)
    const [dateStart, setDateStart] = useState()
    const [dateStop, setDateStop] = useState()
    const [token, setToken] = useState("")
    const contracts = [
        { chainId: 56, contract: "0x00eb2295e1a67269d108ad6eb69cd0e9d3c70b86" },
        { chainId: 11155111, contract: "0x31Fa5b298D17637100e84dE408662aa48E604F6c" },
    ]

    async function addPool() {
        setLoader(true)
        try {
            const signer = provider.getSigner()
            const createPool = new ethers.Contract(contracts.find((e) => e.chainId === networkID).contract, StackingFactory.abi, signer)
            const transaction = await createPool.createPool(dateStart, dateStop, token)
            await transaction.wait()
        } catch {
            console.log("échec de la transaction !")
        } finally {
            setLoader(false)
        }
    }

    return (
        <div id="addPool">
            <h2>Ajouter une pool de Stacking</h2>
            <form onSubmit={addPool}>
                <label>
                    Date de début :
                    <input
                        type="date"
                        onChange={(e) => {
                            let date = new Date(e.target.value)
                            setDateStart(date.getTime())
                        }}
                    />
                </label>
                <br />
                <label>
                    Date de fin :
                    <input
                        type="date"
                        onChange={(e) => {
                            let date = new Date(e.target.value)
                            setDateStop(date.getTime())
                        }}
                    />
                </label>
                <br />
                <label>
                    Token :
                    <input type="text" placeholder="Adresse du token" onChange={(e) => setToken(e.target.value)} />
                </label>
                <br />
                <input type="submit" value="Envoyer" />
            </form>
            <button onClick={addPool}>GO</button>
        </div>
    )
}
