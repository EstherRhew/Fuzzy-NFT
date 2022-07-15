import {atom, selector} from "recoil";

export interface IProfile {
  userId: string;
  name: string;
  email: string;
  image: string;
  walletAddress: string[];
}

export const DEFAULT_PROFILE = {
  userId: "",
  name: "",
  email: "",
  image: "",
  walletAddress: []
}

export const tokenInStorage = () => {
  const token = localStorage.getItem('fuzzy')
  return token || ''
}

export const loginTokenAtom = atom({
  key: 'loginToken',
  default: tokenInStorage()
})

export const profileAtom = atom<IProfile | undefined>({
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

