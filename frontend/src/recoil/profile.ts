import {atom, selector} from "recoil";

interface Profile {
  name: string;
  email: string;
  image?: Buffer;
  walletAddress: [string];
}

export const tokenInStorage = () => {
  const token = localStorage.getItem('fuzzy')
  return token || ''
}

export const loginTokenAtom = atom({
  key: 'loginToken',
  default: tokenInStorage()
})

export const profileAtom = atom<Profile | undefined>({
  key: 'profile',
  default: undefined
})

export const loginStatusAtom = selector({
  key: 'loginStatus',
  get: ({get}) => {
    const profile = get(profileAtom)
    const loginToken = get(loginTokenAtom)
    localStorage.setItem('fuzzy', loginToken)
    if (loginToken === '') {
      return false
    }

    return true
  }
})

