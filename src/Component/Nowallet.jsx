export default function Nowallet() {
    return (
        <div>
            {!window.ethereum && (
                <div id="walletmanquant">
                    <h4>Impossible de trouver votre walet !</h4>
                    <p>
                        Metamask n'est pas détecté sur votre navigateur, veuillez installer l'extension sur <a href="https://metamask.io/">Metamask.io !</a>
                    </p>
                </div>
            )}
        </div>
    )
}
