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
    const [dateStart, setDateStart] = useState(0)
    const [dateEnd, setDateEnd] = useState(0)
    const [totalStake, setTotalStake] = useState(0)
    const [APR, setAPR] = useState(0)
    // const today = new Date().getTime()
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
            getAPR()
        }
        // eslint-disable-next-line
    }, [stacking, GetStacking, totalStake])

    function getAPR() {
        setAPR(((100 * contrat.supplyRewards) / totalStake).toFixed(0))
    }

    async function getStacking() {
        const Stacker = await stacking.stackers(account)
        const stake = Stacker[0] / 10 ** contrat.decimals
        const length = await stacking.getMyPool()
        if (length[5].toNumber() !== 0) {
            const total = await stacking.stakingTimes(length[5] - 1)
            setTotalStake(total.stakingTotalPool.toNumber() / 10 ** contrat.decimals)
        }
        let dateStart = new Date(contrat.about[2].toNumber() * 1000)
        setDateStart(dateStart)
        let dateEnd = new Date(contrat.about[3].toNumber() * 1000)
        setDateEnd(dateEnd)
        setGetStacking(stake)
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
            document.querySelector(".inputAmount").value = ""
            setLoaderStake(false)
        }
    }

    function calculRewards() {
        setInterval(async () => {
            const reward = await stacking.calculateReward(account)
            SetRewards((reward / 10 ** contrat.decimals).toFixed(2))
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
            document.querySelector(".inputAmount").value = ""
            setLoaderUnStake(false)
        }
    }

    if (signer && dateStart)
        return (
            <div>
                <h5>{contrat.name}</h5>
                <p>APR : {APR} %</p>
                <h6>
                    Montant staké : {GetStacking} {contrat.symbol}
                </h6>
                <h6>
                    Total staké : {totalStake} {contrat.symbol}
                </h6>
                Date de début :<br /> {dateStart.getDate()} / {dateStart.getMonth() + 1} / {dateStart.getFullYear()}
                <br />
                Date de fin : <br /> {dateEnd.getDate()} / {dateEnd.getMonth() + 1} / {dateEnd.getFullYear()}
                <br />
                <br />
                <div className="parent">
                    {/* Pool rewards : {contrat.supplyRewards} {contrat.symbol} */}
                    Rewards : {rewards} {contrat.symbol}
                    <button id="claim" onClick={claimRewards}>
                        Claim {loaderRewards && <Spinner animation="border" role="status" size="sm" />}
                    </button>
                </div>
                <div>
                    <button onClick={stake}>Stake {loaderStake && <Spinner animation="border" role="status" size="sm" />}</button>
                    <button id="unStake" onClick={unStake}>
                        UnStake {loaderUnStake && <Spinner animation="border" role="status" size="sm" />}
                    </button>
                    <input type="number" className="inputAmount" placeholder="Nombre de tokens" onChange={(e) => setAmount(e.target.value)} />
                </div>
            </div>
        )
}
