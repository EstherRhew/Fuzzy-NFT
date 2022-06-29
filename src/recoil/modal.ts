import {atom} from "recoil";

type Modal = 'Transfer' | 'AddForm' | 'Detail' | ''

export const ModalAtom = atom<Modal>({
  key: 'Modal',
  default: ''
})