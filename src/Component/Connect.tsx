import { useEffect } from "react"
import useEth from "../Context/useEth"

export default function Connect() {
   const {
      state: { account, provider },
   } = useEth()

   useEffect(() => {
      console.log(account)
   }, [account])

   // const truncate = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/

   //formater l'adresse de connexion à afficher
   // function truncateAddr() {
   //    const match = address.match(truncate)
   //    if (!match) return address
   //    return `${match[1]}…${match[2]}`
   // }

   //connecter metamask à l'aplication
   async function connectDapp() {
      try {
         console.log(10)
         await provider.send("eth_requestaccount", [])
      } catch {
         console.log("Erreur de connection à l'application")
      }
   }

   return (
      <div>
         <h3>Se connecter à l'application de vote !</h3>
         <button onClick={connectDapp}>Connexion</button>
      </div>
   )
}
