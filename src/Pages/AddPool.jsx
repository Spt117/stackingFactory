import { useEth } from "../Context"
import { useState, useEffect } from "react"
import Spinner from "react-bootstrap/esm/Spinner"
import SupplyPool from "../Component/SupplyPool"

export default function AddPool() {
    const {
        state: { createPool },
    } = useEth()
    const unit = 24 * 3600 * 1000
    const today = new Date().getTime() + unit
    const timestamp = new Date(today).toISOString().split("T")[0]
    const [loader, setLoader] = useState(false)
    const [dateStart, setDateStart] = useState(null)
    const [dateStop, setDateStop] = useState(null)
    const [token, setToken] = useState("")

    useEffect(() => {
        setDateEnd()
        // eslint-disable-next-line
    }, [dateStart])

    async function addPool() {
        setLoader(true)
        try {
            const transaction = await createPool.createPool(dateStart, dateStop, token)
            await transaction.wait()
        } catch {
            console.log("La création de la Pool a échoué !")
        } finally {
            setDateStart(null)
            document.querySelector("#inputPool").value = ""
            setLoader(false)
        }
    }

    function setDateEnd() {
        const button = document.querySelector("#dateFin")
        if (dateStart === null) {
            button.disabled = true
        } else button.disabled = false
    }

    return (
        <div>
            <div id="container">
                <div id="addPool">
                    <h2>Ajouter une pool de Stacking</h2>
                    <form>
                        <label>
                            Date de début :
                            <input
                                type="date"
                                min={timestamp}
                                onChange={(e) => {
                                    let date = new Date(e.target.value)
                                    setDateStart(date.getTime() / 1000)
                                }}
                            />
                        </label>
                        <br />
                        <label>
                            Date de fin :
                            <input
                                id="dateFin"
                                type="date"
                                min={new Date(dateStart + unit).toISOString().split("T")[0]}
                                onChange={(e) => {
                                    let date = new Date(e.target.value)
                                    setDateStop(date.getTime() / 1000)
                                }}
                            />
                        </label>
                        <br />
                        <label>
                            Token :
                            <input id="inputPool" type="text" placeholder="Adresse du token" onChange={(e) => setToken(e.target.value)} />
                        </label>
                        <br />
                    </form>
                    <button onClick={addPool}>Valider {loader && <Spinner animation="border" role="status" size="sm" />}</button>
                </div>
            </div>
            <SupplyPool />
        </div>
    )
}
