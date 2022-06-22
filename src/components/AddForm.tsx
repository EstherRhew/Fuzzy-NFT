import React, {useEffect, useState} from 'react';
import {uploadPhoto} from "../service";
import {IItem} from "../type/type";
import {klaytn} from "../klaytn/caver";
import {useRecoilState} from "recoil";
import {accountAtom} from "../recoil/account";
import imageCompression from "../utils/imageCompression";

const MAX_IMAGE_SIZE = 30000 // 30KB
const MAX_IMAGE_SIZE_MB = 0.03 // 30KB

const AddForm = () => {
  const [newItem, setNewItem] = useState<IItem>({
    tokenId: 0,
    photo: '',
    title:'',
    location: '',
    description: '',
    timestamp: '',
  })
  const [preview, setPreview] = useState('');
  const [account, setAccount] = useRecoilState(accountAtom)
  const [isCompressing, setIsCompressing] = useState(false)


  const handleFileChange = async (e: any) => {

    const file = e.target.files[0]

    if (file.size > MAX_IMAGE_SIZE) {
      setIsCompressing(true);
      await compressImage(file)
      setPreview(URL.createObjectURL(file));
      return;
    }

    setNewItem({
      ...newItem,
      photo: file,
    })
    console.log(URL.createObjectURL(e.target.files[0]))
    setPreview(URL.createObjectURL(e.target.files[0]));
  }

  const handleInputChange = (e: any) => {
    setNewItem({
      ...newItem,
      [e.target.id]: e.target.value
    })
  }

  const handleUpload = async (e: any) => {
    e.preventDefault()
    await uploadPhoto(newItem, account)
  }

  const compressImage = async (imageFile: any) => {
    try {
      const compressedFile = await imageCompression(imageFile, MAX_IMAGE_SIZE_MB)
      setIsCompressing(false)
      setNewItem({
        ...newItem,
        photo: compressedFile
      })
    } catch (error) {
      setIsCompressing(false)
      // this.setState({
      //   isCompressing: false,
      //   warningMessage: '* Fail to compress image'
      // })
    }
  }

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(preview)
    }
  }, [])

  return (
    <form className="add_form">
      <div className="form_item">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" onClick={handleInputChange}/>
      </div>
      <div className="form_item">
        <input type="file" accept="image/*" onChange={handleFileChange}/>
      </div>
      <div className="form_item">
        <img className="img_preview" alt="preview" src={preview}></img>
      </div>
      <div className="form_item">
        <label htmlFor="location">Location</label>
        <input type="text" id="location" onClick={handleInputChange}/>
      </div>
      <div className="form_item">
        <label htmlFor="description">Description</label>
        <input type="text" id="description" onClick={handleInputChange}/>
      </div>
      <div className="form_item">
        <button onClick={handleUpload}>Upload</button>
      </div>
    </form>
  );
};

export default AddForm;
