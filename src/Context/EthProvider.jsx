import { useReducer, useCallback, useEffect, useState } from "react"
import EthContext from "./EthContext"
import { reducer, actions, initialState } from "./state"
import { ethers } from "ethers"

function EthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [isConnect, setIsConnect] = useState(false)

    const init = useCallback(async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        const network = await provider._networkPromise
        const networkID = network.chainId
        let account
        switch (isConnect) {
            case true:
                account = await provider.getSigner().getAddress()
                break
            default:
                account = null
        }
        dispatch({
            type: actions.init,
            data: { provider, account, networkID },
        })
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
