import { useReducer, useCallback, useEffect, useState } from "react"
import EthContext from "./EthContext"
import { reducer, actions, initialState } from "./state"
import { ethers } from "ethers"
import StackingFactory from "../artifacts/contracts/StackingFactory.sol/StackingFactory.json"
import Stacking from "../artifacts/contracts/Stacking.sol/Stacking.json"
import IERC20 from "../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json"
import myContracts from "../contrats/address.json"

function EthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [isConnect, setIsConnect] = useState(false)
    const [isContract, setIsContract] = useState(false)

    const init = useCallback(async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const network = await provider._networkPromise
        const networkID = network.chainId
        const stackingAbi = Stacking.abi
        const IERC20Abi = IERC20.abi
        const contract = myContracts.networks[networkID].address
        let account, signer, createPool
        switch (isConnect) {
            case true:
                signer = provider.getSigner()
                account = await signer.getAddress()
                if (contract !== null) {
                    createPool = new ethers.Contract(contract, StackingFactory.abi, signer)
                    setIsContract(true)
                } else {
                    console.log("Vous n'êtes pas sur le bon réseau !")
                    createPool = null
                    setIsContract(false)
                }
                break
            default:
                account = null
                signer = null
                createPool = null
        }
        dispatch({
            type: actions.init,
            data: { provider, signer, account, networkID, createPool, stackingAbi, IERC20Abi },
        })
        // eslint-disable-next-line
    }, [isConnect])

    useEffect(() => {
        if (window.ethereum) {
            isConnected()
            event()
        }
        // eslint-disable-next-line
    }, [init, isConnect])

    //vérifier la connexion metamask
    async function isConnected() {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length) {
            setIsConnect(true)
        } else setIsConnect(false)
        init()
    }

    //détecter les changements de compte et de réseau
    function event() {
        const events = ["chainChanged", "accountsChanged"]
        const handleChange = () => isConnected()

        events.forEach((e) => window.ethereum.on(e, handleChange))
        return () => events.forEach((e) => window.ethereum.removeListener(e, handleChange))
    }

    return (
        <>
            {!isContract && isConnect ? (
                <EthContext.Provider
                    value={{
                        state,
                        dispatch,
                    }}
                >
                    {children}
                </EthContext.Provider>
            ) : (
                <p>Vous n'êtes pas sur le bon réseau !</p>
            )}
        </>
    )
}
export default EthProvider
