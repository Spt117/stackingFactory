// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
const { readFileSync, writeFileSync } = require("fs")
// var fs = require("fs/promises")

async function main() {
    const jsonToObject = JSON.parse(readFileSync("../src/contrats/address.json"))

    // const lockedAmount = hre.ethers.utils.parseEther("1");
    console.log("Début du déploiement !")
    const StackingFactory = await hre.ethers.getContractFactory("StackingFactory")
    console.log("Déploiement en cours !")
    const stackingFactory = await StackingFactory.deploy()
    console.log("Déploiement en phase terminale !")
    await stackingFactory.deployed()
    console.log("Le contrat est déployé à l'adresse: " + stackingFactory.address)

    const network = hre.ethers.provider._network
    let data = { name: network.name, address: stackingFactory.address }

    jsonToObject.networks[network.chainId] = data
    jsonToObject.history.push(data)
    writeFileSync("../src/contrats/address.json", JSON.stringify(jsonToObject, null, 4), async (err) => {
        if (err) {
            // eslint-disable-next-line no-undef
            await _log("Error:" + err)
        }
    })
    console.log("Déploiement sauvegardé ici: ../src/contrats/address.json")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
