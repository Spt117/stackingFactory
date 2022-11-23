import { useReducer, useCallback, useEffect, useState } from "react"
import EthContext from "./EthContext"
import { reducer, actions, initialState } from "./state"
import { ethers } from "ethers"
import StackingFactory from "../artifacts/contracts/StackingFactory.sol/StackingFactory.json"
import Stacking from "../artifacts/contracts/Stacking.sol/Stacking.json"
import IERC20 from "../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json"

function EthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [isConnect, setIsConnect] = useState(false)
    const contracts = [
        { chainId: 56, contract: "0xa6E29685Cf0BBbe22A48D85bC5dc85d1f6e1ae6e" },
        { chainId: 11155111, contract: "0x16620945C908e342896449cC083ae07ACFF4D94A" },
    ]

    const init = useCallback(async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        const network = await provider._networkPromise
        const networkID = network.chainId
        const stackingAbi = Stacking.abi
        const IERC20Abi = IERC20.abi
        let account
        let signer
        let createPool
        switch (isConnect) {
            case true:
                signer = provider.getSigner()
                account = await signer.getAddress()
                createPool = new ethers.Contract(contracts.find((e) => e.chainId === networkID).contract, StackingFactory.abi, signer)
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
        <EthContext.Provider
            value={{
                state,
                dispatch,
            }}
        >
            {children}
        </EthContext.Provider>
    )
}
export default EthProvider