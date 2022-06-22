import GalleryContract from "../klaytn/contract";
import {IItem} from "../type/type";
import {uploadIpfs} from "../ipfs/ipfs";

export const getAllList = async () => {
  const totalCount = await GalleryContract.methods.getTotalPhotoCount().call();
  const list: IItem[] = []
  if (totalCount === 0) {
    return list
  }
  for (let i = 0; i < totalCount; i++) {
    const item = await GalleryContract.methods.getPhoto(i).call();
    list.push(item)
  }
  return Promise.all(list)
}

export const uploadPhoto = async (item: IItem, address: string) => {
  const {photo, title, location, description} = item
  const reader = new window.FileReader();
  reader.readAsArrayBuffer(photo)
  reader.onloadend = async () => {
    if (reader.result == null) {
      return;
    }
    // @ts-ignore
    const buffer = Buffer.from(reader.result)
    const hexString = `0x${buffer.toString('hex')}`
    console.log(title, location, description)
    const res = await GalleryContract.methods.uploadPhoto(hexString, title, location, description).send({
      from: address,
      gas: '200000000'
    })
    console.log(res, 'resss')
  }
}