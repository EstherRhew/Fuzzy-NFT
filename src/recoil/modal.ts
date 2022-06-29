import {atom} from "recoil";

type Modal = 'Transfer' | 'AddForm' | 'Detail' | 'Login' | ''

export const modalAtom = atom<Modal>({
  key: 'Modal',
  default: ''
})