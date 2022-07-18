import {atom, selector} from "recoil";
import sample from "../assets/image/capsule.png"
import {getAllList} from "../service/contract";

const DEFAULT_LIST = []

export const listAtom = atom({
  key: 'list',
  default: DEFAULT_LIST
  // get: async () => await getAllList(),
  // set: ({set}, newValue) => {
  //   set(newValue)
  // }

})

export const myListAtom = atom({
  key: 'myList',
  default: DEFAULT_LIST
})
