import Spinner from "react-bootstrap/esm/Spinner"
import { useState, useEffect } from "react"
import { useEth } from "../Context"
import { ethers } from "ethers"

export default function PoolStacking({ contrat }) {
    const [stacking, setStacking] = useState(null)
    const [loaderStake, setLoaderStake] = useState(false)
    const [loaderUnStake, setLoaderUnStake] = useState(false)
    const [amount, setAmount] = useState(0)
    const [GetStacking, setGetStacking] = useState(0)
    const [rewards, SetRewards] = useState(0)
    const [loaderRewards, setLoaderRewards] = useState(false)
    const today = new Date().getTime()
    const {
        state: { signer, stackingAbi, IERC20Abi, account },
    } = useEth()

    useEffect(() => {
        if (signer) setStacking(new ethers.Contract(contrat.addressPool, stackingAbi, signer))
        // eslint-disable-next-line
    }, [signer])

    useEffect(() => {
        if (stacking) {
            getStacking()
            calculRewards()
        }
        // eslint-disable-next-line
    }, [stacking])

    function getAPR(stake) {
        let rewardsPerSecond = contrat.about[4] / (contrat.about[3] - contrat.about[2]) / 10 ** contrat.decimals
        console.log(rewardsPerSecond)
        let APR = (rewardsPerSecond * 100 * (contrat.about[3] - today)) / stake
        console.log(APR)
        console.log(contrat.supplyRewards)
    }

    async function getStacking() {
        const Stacker = await stacking.stackers(account)
        let stake = Stacker[0] / 10 ** contrat.decimals
        setGetStacking(stake)
        getAPR(stake)
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
            console.log(allowance)
            if (allowance < amountBN) {
                const approuval = await erc20.approve(contrat.addressPool, amountBN)
                await approuval.wait()
            }
            const transaction = await stacking.stake(amountBN)
            await transaction.wait()
        } catch (err) {
            console.log(err)
        } finally {
            document.querySelector(".inputAmount").value = ""
            setLoaderStake(false)
        }
    }

    function calculRewards() {
        setInterval(async () => {
            const reward = await stacking.calculateReward(account)
            SetRewards(reward.toString())
        }, 3000)
    }

    async function claimRewards() {
        setLoaderRewards(true)
        try {
            const transaction = await stacking.claimRewards()
            await transaction.wait()
        } catch {
            console.log("Echec de la transaction !")
        } finally {
            setLoaderRewards(false)
        }
    }

    async function unStake() {
        setLoaderUnStake(true)
        try {
            const amountBN = ethers.utils.parseUnits(amount, contrat.decimals)
            const transaction = await stacking.withdraw(amountBN)
            await transaction.wait()
        } catch {
            console.log("Echec de la transaction !")
        } finally {
            setLoaderUnStake(false)
        }
    }

    if (signer)
        return (
            <div>
                <h5>{contrat.name}</h5>
                <p>APR: 15%</p>
                <div>
                    <button onClick={stake}>Stake {loaderStake && <Spinner animation="border" role="status" size="sm" />}</button>
                    <button onClick={unStake}>UnStake {loaderUnStake && <Spinner animation="border" role="status" size="sm" />}</button>
                </div>
                <input type="number" className="inputAmount" placeholder="Nombre de tokens" onChange={(e) => setAmount(e.target.value)} />
                <h6>
                    Montant stacké : {GetStacking} {contrat.symbol}
                </h6>
                <p>
                    Rewards : {rewards} {contrat.symbol}
                </p>
                <button onClick={claimRewards}>Claim {loaderRewards && <Spinner animation="border" role="status" size="sm" />}</button>
            </div>
        )
}
