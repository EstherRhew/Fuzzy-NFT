import {atom, selector} from "recoil";
import {klaytn} from "../klaytn/caver";

export const connectWallet = async () => {
  try {
    const accounts = await klaytn.enable()
    const account = accounts[0]
    return account
  } catch (err) {
    return null
  }
}

export const disconnectWallet = () => {
  localStorage.setItem('login', 'false')
}

export const kaikasSelectedAddress = () => {
  return klaytn.selectedAddress;
}

export const isUnlocked = async () => {
  return await klaytn._kaikas.isUnlocked();
}

export const setStorageLogin = () => {
  localStorage.setItem('login', 'true')
}



export const onAccountsChanged = (handler) => {
  klaytn.on('accountsChanged', (account) => {
    handler(account[0])
  })
}

export const onUnlockAccount = (handler) => {
  const loop = () => {
    setTimeout(async () => {
      const unlocked = await isUnlocked()
      // console.log(unlocked)
      handler(unlocked)
      loop()
    }, 1500)
  }
  loop();
}

export const walletUnlockStatusAtom = atom({
  key: 'walletStatus',
  default: !!kaikasSelectedAddress()
})

export const storageStatusAtom = atom({
  key: 'storageStatus',
  default: false
})

export const accountAtom = atom({
  key: 'account',
  default: kaikasSelectedAddress()
})

// export const loginStatusAtom = selector({
//   key: 'loginStatus',
//   get: ({get}) => {
//     const walletStatus = get(walletStatusAtom)
//     const storageStatus = get(storageStatusAtom)
//     return walletStatus && storageStatus
//   }
// })

// export const loginStatusAtom = atom({
//   key: 'loginStatus',
//   default: false
// })