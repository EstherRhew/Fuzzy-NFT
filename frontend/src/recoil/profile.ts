import {atom, selector} from "recoil";

interface Profile {
  name: string;
  email: string;
  image?: Buffer;
  walletAddress: [string];
}

export const isStorageLoggedIn = () => {
  const status = localStorage.getItem('loginStatus')
  return status && JSON.parse(status)
}

export const profileAtom = atom<Profile | undefined>({
  key: 'profile',
  default: undefined
})

export const loginStatusAtom = selector({
  key: 'loginStatus',
  get: ({get}) => {
    const profile = get(profileAtom)
    if (!profile || profile?.email === '') {
      console.log('local storage false')
      localStorage.setItem('loginStatus', 'false')
      return false
    }
    console.log('local storage true')
    localStorage.setItem('loginStatus', 'true')
    return true
  }
})

// export const storageStatusAtom = selector({
//   key: 'storageStatus',
//   get: ({get}) => {
//     const loginStatus = get(loginStatusAtom)
//     return
//   }
// })