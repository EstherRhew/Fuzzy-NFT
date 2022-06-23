import GalleryContract from "../klaytn/contract";
import {INewItem, IUploadedItem} from "../type/type";
import {uploadIpfs} from "../ipfs/ipfs";

export const getAllList = async () => {
  const totalCount = await GalleryContract.methods.getTotalPhotoCount().call();
  const list: IUploadedItem[] = []
  if (totalCount === 0) {
    return list
  }
  for (let i = 1; i <= totalCount; i++) {
    const res = await GalleryContract.methods.getPhoto(i).call();
    const item = {
      tokenId: res[0],
      ownerHistory: res[1],
      photo: res[2],
      title: res[3],
      location: res[4],
      description: res[5],
      timestamp: res[6]
    }
    list.push(item)
  }
  console.log(list, 'list')
  return Promise.all(list)
}

export const uploadPhoto = async (item: INewItem, address: string) => {
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