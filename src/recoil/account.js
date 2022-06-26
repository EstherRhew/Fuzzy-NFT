import {atom, selector} from "recoil";
import {klaytn} from "../klaytn/caver";

export const connectWallet = async () => {
  try {
    const accounts = await klaytn.enable()
    const account = accounts[0]
    localStorage.setItem('login', 'true')
    return account
  } catch (err) {
    return null
  }
}

export const disconnectWallet = () => {
  localStorage.setItem('login', 'false')
}

const isLoggedIn = () => {
  return klaytn.selectedAddress;
}

export const isUnlocked = async () => {
  return await klaytn._kaikas.isUnlocked();
}

export const isStorageLoggedIn = () => {
  const status = localStorage.getItem('login')
  return JSON.parse(status)
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
      handler(unlocked)
      loop()
    }, 1500)
  }
  loop();
}

export const walletStatusAtom = atom({
  key: 'walletStatus',
  default: !!klaytn.selectedAddress
})

export const storageStatusAtom = atom({
  key: 'storageStatus',
  default: false
})

export const accountAtom = atom({
  key: 'account',
  default: isLoggedIn()
})

export const loginStatusAtom = selector({
  key: 'loginStatus',
  get: ({get}) => {
    const walletStatus = get(walletStatusAtom)
    const storageStatus = get(storageStatusAtom)
    return walletStatus && storageStatus
  }
})