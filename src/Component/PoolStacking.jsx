import Spinner from "react-bootstrap/esm/Spinner"
import { useState, useEffect } from "react"
import { useEth } from "../Context"
import { ethers } from "ethers"

export default function PoolStacking({ contrat }) {
    const [stacking, setStacking] = useState(0)
    const [loader, setLoader] = useState(0)
    const [amount, setAmount] = useState(0)
    const [GetStacking, setGetStacking] = useState(0)
    const [rewards, SetRewards] = useState("0.00")
    // const [dateStart, setDateStart] = useState(0)
    // const [dateEnd, setDateEnd] = useState(0)
    const [totalStake, setTotalStake] = useState(0)
    const [APR, setAPR] = useState(0)
    const today = new Date().getTime() / 1000
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
        buttons()
        // eslint-disable-next-line
    }, [stacking, GetStacking, totalStake, rewards])

    function getAPR() {
        // if (totalStake !== 0)
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
        setGetStacking(stake)
        event()
    }

    function buttons() {
        if (GetStacking !== 0) document.querySelector(`#${contrat.name + "unStake"}`).disabled = false
        else document.querySelector(`#${contrat.name + "unStake"}`).disabled = true

        if (rewards !== "0.00") document.querySelector(`#${contrat.name + "claim"}`).disabled = false
        else document.querySelector(`#${contrat.name + "claim"}`).disabled = true

        if (today < contrat.about[2].toNumber()) document.querySelector(`#${contrat.name + "stake"}`).disabled = true
        else document.querySelector(`#${contrat.name + "stake"}`).disabled = false
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
        setLoader(1)
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
            document.querySelector(`#${contrat.name + "input"}`).value = ""
        } catch (err) {
            console.log(err)
        } finally {
            setLoader(0)
        }
    }

    function calculRewards() {
        setInterval(async () => {
            const reward = await stacking.calculateReward(account)
            SetRewards((reward / 10 ** contrat.decimals).toFixed(2))
        }, 3000)
    }

    async function claimRewards() {
        setLoader(2)
        try {
            const transaction = await stacking.claimRewards()
            await transaction.wait()
        } catch {
            console.log("Echec de la transaction !")
        } finally {
            setLoader(0)
        }
    }

    async function unStake() {
        setLoader(3)
        try {
            const amountBN = ethers.utils.parseUnits(amount, contrat.decimals)
            const transaction = await stacking.withdraw(amountBN)
            await transaction.wait()
            document.querySelector(`#${contrat.name + "input"}`).value = ""
        } catch {
            console.log("Echec de la transaction !")
        } finally {
            setLoader(0)
        }
    }

    if (signer)
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
                {/* Date de début :<br /> {dateStart.getDate()} / {dateStart.getMonth() + 1} / {dateStart.getFullYear()}
                <br />
                Date de fin : <br /> {dateEnd.getDate()} / {dateEnd.getMonth() + 1} / {dateEnd.getFullYear()}
                <br /> */}
                <br />
                <div className="parent">
                    {/* Pool rewards : {contrat.supplyRewards} {contrat.symbol} */}
                    Rewards : {rewards} {contrat.symbol}
                    <button className="buttonPool" id={contrat.name + "claim"} onClick={claimRewards}>
                        Claim {loader === 2 && <Spinner animation="border" role="status" size="sm" />}
                    </button>
                </div>
                <div>
                    <button className="buttonPool" id={contrat.name + "stake"} onClick={stake}>
                        Stake {loader === 1 && <Spinner animation="border" role="status" size="sm" />}
                    </button>
                    <button className="buttonPool" id={contrat.name + "unStake"} onClick={unStake}>
                        UnStake {loader === 3 && <Spinner animation="border" role="status" size="sm" />}
                    </button>
                    <input type="number" id={contrat.name + "input"} placeholder="Nombre de tokens" onChange={(e) => setAmount(e.target.value)} />
                </div>
            </div>
        )
}
