import GalleryContract from "../klaytn/contract";
import {INewItem, IUploadedItem} from "../type/type";
import {ipfs} from "../ipfs/ipfs";
import {ensureIpfsUriPrefix, stripIpfsUriPrefix} from "../utils/misc";
import axios from "axios";

export const getAllList = async () => {
  const totalCount = await GalleryContract.methods.getTotalPhotoCount().call();
  const list: IUploadedItem[] = []
  if (totalCount === 0) {
    return list
  }
  for (let i = 1; i <= totalCount; i++) {
    const res = await GalleryContract.methods.getPhoto(i).call();
    const metadata = await getNFTMetadata(i.toString())
    const photoUrl = await getImageUrl(metadata.image)
    const item = {
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
  const res = await axios(`https://ipfs.infura.io/ipfs/${url}`)
  return `https://ipfs.infura.io/ipfs/${url}`
}

const getNFTMetadata = async (tokenId: string) => {
  const metadataURI = await GalleryContract.methods.tokenURI(tokenId).call();
  const cid = stripIpfsUriPrefix(metadataURI)
    const res = await axios(`https://ipfs.infura.io/ipfs/${cid}`)
    const data = res.data

    return data
}


export const uploadPhoto = async (item: INewItem, address: string) => {
  try {
    await createNFTFromAssetData(item.photo, item, address)
  } catch (err) {
    console.log(err)
  }
}

export const mintToken = async (address:string, metadataUri: string) => {
  metadataUri = stripIpfsUriPrefix(metadataUri)

  const tx = await GalleryContract.methods.uploadPhoto(address, metadataUri).send({
        from: address,
        gas: '200000000'
  })
  console.log(tx, 'tx')
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
  const tokenId = await mintToken(address, metadataURI)
  return {
    tokenId,
    metadata,
    assetURI,
    metadataURI,
  }

}

const makeNFTMetadata = (assetURI: string, options: INewItem) => {
  const {fileName, location, description, photo} = options;
  assetURI = ensureIpfsUriPrefix(assetURI)
  return {
    name: fileName,
    description: description,
    image: assetURI,
    location
  }
}

export const ownerOf = async (tokenId: string) => {
  const owner = await GalleryContract.methods.ownerOf(tokenId).call()
  console.log(owner, 'owner')
}

export const transferNft = async (tokenId: string, to: string, from: string) => {
  console.log(tokenId, to, from, 'hhhh')
  await GalleryContract.methods.transferOwnership(tokenId, to).send({
    from,
    gas: 20000000
  })
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
