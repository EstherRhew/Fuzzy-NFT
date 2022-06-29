import {atom} from "recoil";
import sample from "../assets/image/capsule.png"

const DEFAULT_LIST = []

export const listAtom = atom({
  key: 'list',
  default: DEFAULT_LIST,
})