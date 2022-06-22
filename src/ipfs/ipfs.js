const ipfsAPI = require('ipfs-api');

const ipfs = ipfsAPI('192.168.0.8' ,'5001', {protocol: 'http'})

export const uploadIpfs = (buffer) => {
  ipfs.files.add(buffer, (err, file) => {
    if (err) {
      console.log(err)
    }
    console.log(file)
  })
}