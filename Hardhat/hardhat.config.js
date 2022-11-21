require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
const GOERLI_URL = process.env.GOERLI_URL
const SEPOLIA_URL = process.env.SEPOLIA_URL
const MUMBAI_URL = process.env.MUMBAI_URL
const POLYGON_URL = process.env.POLYGON_URL
const PRIVAT_KHEY = process.env.PRIVAT_KHEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   paths: {
      artifacts: "../src/artifacts",
   },
   networks: {
      mumbai: {
         url: MUMBAI_URL,
         accounts: [PRIVAT_KHEY],
      },
      polygon: {
         url: POLYGON_URL,
         accounts: [PRIVAT_KHEY],
      },
      goerli: {
         url: GOERLI_URL,
         accounts: [PRIVAT_KHEY],
      },
      sepolia: {
         url: SEPOLIA_URL,
         accounts: [PRIVAT_KHEY],
      },
   },
   solidity: "0.8.16",
}
