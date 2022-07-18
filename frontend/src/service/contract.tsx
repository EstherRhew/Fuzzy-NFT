import GalleryContract from "../klaytn/contract";
import {INewItem, IUploadedItem} from "../type/type";
import {ipfs} from "../ipfs/ipfs";
import {ensureIpfsUriPrefix, last, stripIpfsUriPrefix} from "../utils/misc";
import axios from "axios";
import {getUserData, getUserIdByAddress} from "./user";

const LIMIT = 5

export const getTotalCount = async () => {
  return await GalleryContract.methods.getTotalPhotoCount().call();
}

export const getAllList = async (pageIndex: number) => {
  const totalCount = await getTotalCount();
  // let index = lastIndex || totalCount
  const lastIndex = totalCount - (pageIndex * (LIMIT))
  const list: IUploadedItem[] = []
  if (lastIndex === 0) {
    return list
  }
  let offset = lastIndex - (LIMIT - 1)
  if (offset < 1) {
    offset = 1
  }

  for (let i = offset; i <= lastIndex; i++) {
    const res = await GalleryContract.methods.getPhoto(i).call();
    const metadata = await getNFTMetadata(i.toString())
    const ownerId = await getUserIdByAddress(last(res[1]))
    const userData = await getUserData(ownerId)
    const photoUrl = await getImageUrl(metadata.image)
    const item = {
      ownerName: userData?.name,
      tokenId: res[0],
      ownerHistory: res[1],
      location: metadata.location,
      description: metadata.description,
      photo: photoUrl,
      timestamp: res[3]
    }
    list.push(item)
  }

  return Promise.all(list)
}

export const getMyList = async (account: string, token: string) => {
  const balance = await GalleryContract.methods.balanceOf(account).call()
  const list: IUploadedItem[] = []
  if (balance === 0) {
    return list
  }
  for (let i = 0; i < balance; i++) {
    const tokenId = await GalleryContract.methods.tokenOfOwnerByIndex(account, i).call();
    const res = await GalleryContract.methods.getPhoto(tokenId).call();
    const metadata = await getNFTMetadata(tokenId)
    const ownerId = await getUserIdByAddress(last(res[1]))
    const userData = await getUserData(ownerId)
    const photoUrl = await getImageUrl(metadata.image)
    // console.log(tokenId, res, metadata, photoUrl, 'hereee')
    const item = {
      ownerName: userData?.name,
      tokenId: res[0],
      ownerHistory: res[1],
      location: metadata.location,
      description: metadata.description,
      photo: photoUrl,
      timestamp: res[3]
    }
    list.push(item)
  }
  return Promise.all(list)
}


const getImageUrl = async (metadataUrl: string) => {
  const url = stripIpfsUriPrefix(metadataUrl)
  return `https://ipfs.infura.io/ipfs/${url}`
}

const getNFTMetadata = async (tokenId: string) => {
  try {
    const metadataURI = await GalleryContract.methods.tokenURI(tokenId).call();
    const cid = stripIpfsUriPrefix(metadataURI)
    const res = await axios(`https://ipfs.infura.io/ipfs/${cid}`)
    const data = res.data
    return data
  } catch (e) {
    console.log(e)
  }

}


export const uploadPhoto = async (item: INewItem, address: string) => {
  try {
    await createNFTFromAssetData(item.photo, item, address)
  } catch (err) {
    console.log(err)
  }
}

const createNFTFromAssetData = async (file: any, options: INewItem, address: string) => {
  const reader = new window.FileReader();
  reader.readAsArrayBuffer(file)
  // @ts-ignore
  const {cid: assetCid} = await ipfs.add(file)
  const assetURI = ensureIpfsUriPrefix(assetCid)
  const metadata = makeNFTMetadata(assetURI, options)
  const {cid: metadataCid} = await ipfs.add({
    path: '/nft/metadata.json',
    content: JSON.stringify(metadata)
  })
  const metadataURI = ensureIpfsUriPrefix(metadataCid) + '/metadata.json';
  await mintToken(address, metadataURI)
}

export const mintToken = async (address:string, metadataUri: string) => {
  try {
    metadataUri = stripIpfsUriPrefix(metadataUri)
    await GalleryContract.methods.uploadPhoto(address, metadataUri).send({
      from: address,
      gas: '200000000'
    })
  } catch (e) {
    console.log(e)
  }
}

const makeNFTMetadata = (assetURI: string, options: INewItem) => {
  const {fileName, location, description} = options;
  // assetURI = ensureIpfsUriPrefix(assetURI)
  return {
    name: fileName,
    description: description,
    image: assetURI,
    location
  }
}


export const transferNft = async (tokenId: string, to: string, from: string) => {
  try {
    await GalleryContract.methods.transferOwnership(tokenId, to).send({
      from,
      gas: 20000000
    })
  } catch (e) {
    console.log(e)
  }

}

// IPFS not used
// export const uploadPhoto = async (item: INewItem, address: string) => {
// const {photo, location, description} = item
// const reader = new window.FileReader();
// reader.readAsArrayBuffer(photo)
// reader.onloadend = async () => {
//   if (reader.result == null) {
//     return;
//   }
//   // @ts-ignore
//   const buffer = Buffer.from(reader.result)
//   const hexString = `0x${buffer.toString('hex')}`
//   console.log(location, description)
//   const res = await GalleryContract.methods.uploadPhoto(hexString, location, description).send({
//     from: address,
//     gas: '200000000'
//   })
//   console.log(res, 'resss')
// }
//   }
