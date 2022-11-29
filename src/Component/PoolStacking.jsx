import Spinner from "react-bootstrap/esm/Spinner"
import { useState, useEffect } from "react"
import { useEth } from "../Context"
import { ethers } from "ethers"

export default function PoolStacking({ contrat }) {
    const [stacking, setStacking] = useState(null)
    const [loaderStake, setLoaderStake] = useState(false)
    const [amount, setAmount] = useState(0)
    const [GetStacking, setGetStacking] = useState(0)
    const {
        state: { signer, stackingAbi, IERC20Abi, account },
    } = useEth()

    useEffect(() => {
        if (signer) setStacking(new ethers.Contract(contrat.addressPool, stackingAbi, signer))
    }, [signer])

    useEffect(() => {
        if (stacking) getStacking()
    }, [stacking])

    async function getStacking() {
        const Stacker = await stacking.stackers(account)
        setGetStacking((Stacker[0] / 10 ** contrat.decimals).toString())
        event()
    }

    function event() {
        stacking.on("Stake", (address, amount, date) => {
            getStacking()
        })
        stacking.on("Unstake", (address, amount, date) => {
            getStacking()
        })
    }

    async function stake() {
        setLoaderStake(true)
        const erc20 = new ethers.Contract(contrat.addressToken, IERC20Abi, signer)
        try {
            const amountBN = ethers.utils.parseUnits(amount, contrat.decimals)
            const allowance = await erc20.allowance(account, contrat.addressPool)
            if (allowance < amountBN) {
                const approuval = await erc20.approve(contrat.addressPool, amountBN)
                await approuval.wait()
            }
            const transaction = await stacking.stake(amountBN)
            await transaction.wait()
        } catch (err) {
            console.log(err)
        } finally {
            document.querySelector(".inputAmount").value = 0
            setLoaderStake(false)
        }
    }

    if (signer)
        return (
            <div>
                <h5>{contrat.name}</h5>
                <p>APR: 15%</p>
                <button onClick={stake}>Stake {loaderStake && <Spinner animation="border" role="status" size="sm" />}</button>
                <input type="number" className="inputAmount" placeholder="Nombre de token" onChange={(e) => setAmount(e.target.value)} />
                <h6>
                    Montant stacké : {GetStacking} {contrat.symbol}
                </h6>
            </div>
        )
}
