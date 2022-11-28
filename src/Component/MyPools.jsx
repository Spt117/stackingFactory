import { useEffect, useState } from "react"
import { useEth } from "../Context"
import Spinner from "react-bootstrap/esm/Spinner"
import { ethers } from "ethers"

export default function Pools({ contrat }) {
    const {
        state: { signer, IERC20Abi, stackingAbi, account },
    } = useEth()
    const [amount, setAmount] = useState()
    const [loader, setLoader] = useState(false)
    const [isSupplied, setIsSupplied] = useState(false)

    useEffect(() => {
        if (contrat.supply !== "0") setIsSupplied(true)
        // eslint-disable-next-line
    }, [isSupplied])

    async function supplyPool(contrat) {
        const stacking = new ethers.Contract(contrat, stackingAbi, signer)
        setLoader(true)
        try {
            const aboutPool = await stacking.getMyPool()
            const erc20 = new ethers.Contract(aboutPool[0], IERC20Abi, signer)
            const decimals = await erc20.decimals()
            const supply = ethers.utils.parseUnits(amount, decimals)
            const allowance = await erc20.allowance(account, contrat)
            if (allowance < supply) {
                const approuval = await erc20.approve(contrat, supply)
                await approuval.wait()
            }
            const transaction = await stacking.supplyContract(supply)
            await transaction.wait()
            setIsSupplied(true)
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
                {isSupplied && contrat.supply !== "0" && (
                    <p>
                        Allocation rewards: {contrat.supply} {contrat.symbol}
                    </p>
                )}
            </div>
            {!isSupplied && (
                <div>
                    <h5>Alimentez votre pool en rewards</h5>
                    <input placeholder="Nombre de tokens" type="number" onChange={(e) => setAmount(e.target.value.toString())} />
                    <button onClick={() => supplyPool(contrat.addressPool)}>OK {loader && <Spinner animation="border" role="status" size="sm" />}</button>
                </div>
            )}
        </div>
    )
}
