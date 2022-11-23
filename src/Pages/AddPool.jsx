import { useEth } from "../Context"
import { useState } from "react"
import SupplyPool from "../Component/SupplyPool"

export default function AddPool() {
    const {
        state: { createPool },
    } = useEth()
    const [loader, setLoader] = useState(false)
    const [dateStart, setDateStart] = useState()
    const [dateStop, setDateStop] = useState()
    const [token, setToken] = useState("")

    async function addPool() {
        setLoader(true)
        try {
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
            <form>
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
            </form>
            <button onClick={addPool}>Valider</button>
            <SupplyPool />
        </div>
    )
}
