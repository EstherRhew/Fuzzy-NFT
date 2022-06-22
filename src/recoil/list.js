import {atom} from "recoil";
import sample from "../assets/image/capsule.png"

const DEFAULT_LIST = [{
  tokenId: 1,
  photo: sample,
  title: 'Title',
  location: 'Seoul',
  description: 'Happy happy day',
  timestamp: '2312435',
  },
]

export const listAtom = atom({
  key: 'list',
  default: DEFAULT_LIST,
})