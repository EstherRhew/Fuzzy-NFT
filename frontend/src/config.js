// require("dotenv").config();

const configs = {
  PUBLIC_NODE_URL: 'https://api.baobab.klaytn.net:8651',
  NETWORK_ID: '1001',
  PRIVATE_KEY: process.env.REACT_APP_PRIVATE_KEY,
  PUBLIC_KEY: process.env.REACT_APP_PUBLIC_KEY,
  CONTRACT_ADDRESS: '0x85609FA9FB8F1428Af8F830ed3b58e1d5F85046d',
  OPENSEA_URL: 'https://testnets.opensea.io/assets/baobab',
  KLAYTN_SCOPE_URL: 'https://baobab.scope.klaytn.com',
  USER_API_URL: 'http://127.0.0.1:5000/api/users'
}

export default configs