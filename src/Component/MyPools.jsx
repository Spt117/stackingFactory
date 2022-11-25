import { useState } from "react"
import { useEth } from "../Context"
import Spinner from "react-bootstrap/esm/Spinner"
import { ethers } from "ethers"

export default function Pools({ contrat }) {
    const {
        state: { signer, IERC20Abi, stackingAbi, account },
    } = useEth()
    const [amount, setAmount] = useState(0)
    const [loader, setLoader] = useState(false)

    async function supplyPool(contrat) {
        const stacking = new ethers.Contract(contrat, stackingAbi, signer)
        setLoader(true)
        try {
            const token = await stacking.token()
            const ierc20 = new ethers.Contract(token, IERC20Abi, signer)
            const allowance = await ierc20.allowance(account, contrat)
            if (allowance < amount) {
                const approuval = await ierc20.approve(contrat, amount)
                await approuval.wait()
            }
            const transaction = await stacking.supplyContract(amount)
            await transaction.wait()
        } catch (err) {
            console.log(err)
        } finally {
            setLoader(false)
        }
    }
    return (
        <div>
            <div>
                <p>Nom: {contrat.name}</p>
                <p>Symbole: {contrat.symbol}</p>
                <p>Décimales: {contrat.decimals}</p>
                <p>Adresse: {contrat.addressPool}</p>
                <p>
                    Allocation rewards: {contrat.supply / 10 ** contrat.decimals} {contrat.symbol}
                </p>
            </div>
            {contrat.supply === 0 && (
                <div>
                    <h5>Alimentez votre pool en rewards</h5>
                    <input placeholder="Nombre de tokens" type="number" onChange={(e) => setAmount(e.target.value * 10 ** contrat.decimals)} />
                    <button onClick={() => supplyPool(contrat.addressPool)}>OK {loader && <Spinner animation="border" role="status" size="sm" />}</button>
                </div>
            )}
        </div>
    )
}
