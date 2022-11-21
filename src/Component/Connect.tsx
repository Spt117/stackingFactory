import { useEffect, useState } from "react";
import { ethers } from "ethers"


export function Connect() {
    const [bool, setBool] = useState(false)
    const [address, setAdress] = useState('')
   const truncate = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/


    // eslint-disable-next-line
    useEffect(() => {
        if(window.ethereum && bool) {
            const signer = new ethers.providers.Web3Provider(window.ethereum, "any").getSigner()
            const address = async () => { 
              let  myaddr = await signer.getAddress()
              setAdress(myaddr)
            }
            address()
        }
        console.log(bool)
    }, [])

    //vérifier la connexion metamask et agir sur le bouton de connexion à l'application
   async function isConnected() {
      try {
         const accounts = await window.ethereum.request({ method: "eth_accounts" })
         if (accounts.length) {
            setBool(true)
         } else {
            setBool(false)
         }
      } catch {
         console.log("Erreur dans la vérification de connexion")
      }
   }

      //connecter metamask à l'aplication
   async function connectDapp() {
      try {
         const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
         await provider.send("eth_requestAccounts", [])
         setBool(true)
      } catch {
         console.log("Erreur de connection à l'application")
      }
   }


       //formater l'adresse de connexion à afficher
   function truncateAddr() {
      const match = address.match(truncate)
      if (!match) return address
      return `${match[1]}…${match[2]}`
   }



    return(
        <div>
            {address && <p>{truncateAddr()}</p>}
                  <div id="connexion">
         {!bool && window.ethereum && (
            <div>
               <h3>Se connecter à l'application de vote !</h3>
               <button onClick={connectDapp}>Connexion</button>
            </div>
         )}
      </div>
        </div>
    )
}