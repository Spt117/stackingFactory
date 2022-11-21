import useEth from "../Context/useEth"
import { ethers } from "ethers"

export default function Connect() {
    const {
        state: { account },
    } = useEth()

    const truncate = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/

    //  formater l'adresse de connexion à afficher
    function truncateAddr() {
        const match = account.match(truncate)
        if (!match) return account
        return `${match[1]}…${match[2]}`
    }

    //connecter metamask à l'aplication
    async function connectDapp() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
            await provider.send("eth_requestAccounts", [])
        } catch {
            console.log("Erreur de connection à l'application")
        }
    }

    return (
        <div id="account">
            {!account && (
                <div>
                    <h3>Se connecter à l'application de vote !</h3>
                    <button onClick={connectDapp}>Connexion</button>
                </div>
            )}
            {account && <p>Adresse de connexion : {truncateAddr()}</p>}
        </div>
    )
}
