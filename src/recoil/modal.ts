import {atom} from "recoil";

type Modal = 'Transfer' | 'AddForm' | ''

export const ModalAtom = atom<Modal>({
  key: 'Modal',
  default: ''
})