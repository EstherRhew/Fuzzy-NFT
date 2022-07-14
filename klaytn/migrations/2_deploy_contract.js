const Gallery = artifacts.require('./Gallery.sol')
const fs = require('fs')

module.exports = function (deployer) {
  const tokenName = 'Gallery'
  const symbol = 'G'
  const baseURI = 'ipfs://'
  deployer.deploy(Gallery, tokenName, symbol, baseURI)
    .then(() => {
      if (Gallery._json) {
        fs.writeFile(
          'GalleryAbi.json',
          JSON.stringify(Gallery._json.abi, 2),
          (err) => {
            if (err) throw err
            console.log(`The abi of ${Gallery._json.contractName} is recorded on deployedABI file`)
          }
        )
      }
      fs.writeFile(
        'deployedAddress',
        Gallery.address,
        (err) => {
          if (err) throw err
          console.log(`The deployed contract address * ${Gallery.address} * is recorded on deployedAddress file`)
        }
      )
    })
}