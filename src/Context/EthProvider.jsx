import React, { useReducer, useCallback, useEffect, useState } from "react"
import EthContext from "./EthContext"
import { reducer, actions, initialState } from "./state"
import { ethers } from "ethers"

function EthProvider({ children }) {
   const [state, dispatch] = useReducer(reducer, initialState)
   const [isConnect, setIsConnect] = useState(false)

   const init = useCallback(async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
      const networkID = await provider._networkPromise.chainId
      const account = await provider.getSigner().getAddress()
      dispatch({
         type: actions.init,
         data: { provider, account, networkID },
      })
   }, [])

   useEffect(() => {
      isConnected()
      if (isConnect) init()
   }, [init, isConnect])

   //vérifier la connexion metamask et agir sur le bouton de connexion à l'application
   async function isConnected() {
      try {
         const accounts = await window.ethereum.request({ method: "eth_accounts" })
         if (accounts.length) {
            setIsConnect(true)
         } else {
            setIsConnect(false)
         }
      } catch {
         console.log("Erreur dans la vérification de connexion")
      }
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
