import React, {useEffect, useState} from 'react';
import {getAllList, getTotalCount, uploadPhoto} from "../../service/contract";
import { INewItem} from "../../type/type";
import {useRecoilState, useRecoilValue} from "recoil";
import {accountAtom} from "../../recoil/account";
import previewSample from '../../assets/image/star-regular.svg'
import closeIcon from '../../assets/image/xmark-solid.svg'
import Button from "../Button";
import {modalAtom} from "../../recoil/modal";
import {listAtom} from "../../recoil/list";
import {loginTokenAtom, profileAtom} from "../../recoil/profile";

const AddForm = () => {
  const [newItem, setNewItem] = useState<INewItem>({
    photo: '',
    fileName: '',
    location: '',
    description: '',
  })
  const [preview, setPreview] = useState('');
  const [account, setAccount] = useRecoilState(accountAtom)
  const [modal, setModal] = useRecoilState(modalAtom)
  const [list, setList] = useRecoilState(listAtom)
  const loginToken = useRecoilValue(loginTokenAtom)

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]

    setNewItem({
      ...newItem,
      photo: file,
      fileName: file.name,
    })
    setPreview(URL.createObjectURL(file));
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
    setModal('');
    const list = await getAllList(0);
    setList(list)
  }

  // const compressImage = async (imageFile: any) => {
  //   try {
  //     const compressedFile = await imageCompression(imageFile, MAX_IMAGE_SIZE_MB)
  //     setIsCompressing(false)
  //     setNewItem({
  //       ...newItem,
  //       photo: compressedFile
  //     })
  //   } catch (error) {
  //     setIsCompressing(false)
  //     // this.setState({
  //     //   warningMessage: '* Fail to compress image'
  //     // })
  //   }
  // }

  const onCloseModal = () => {
    setModal('');
  }

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(preview)
    }
  }, [])


  return (
    <form className="add_form">
      <h4 className="form_header">
        <span>Upload Photo</span>
        <img src={closeIcon} alt="" className="close_icon" onClick={onCloseModal}/>
      </h4>
        <div className="form_item">
          <label className="file_search_text">Search file</label>
          <div className="file_search">
            <input type="text" disabled={true} value={newItem.fileName}/>
            <label htmlFor="file" className="input_file_btn">
              Search
            </label>
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} id="file"/>
        </div>
        <div className="form_item image">
          {preview === ''
          ? <img className="img_preview sample" alt="preview" src={previewSample}></img>
          : <img className="img_preview" alt="preview" src={preview}></img>
          }

        </div>
      {/*<div className="form_item">*/}
      {/*  <label htmlFor="title">Title</label>*/}
      {/*  <input type="text" id="title" onChange={handleInputChange}/>*/}
      {/*</div>*/}
      <div className="form_item">
        <label htmlFor="location">Location</label>
        <input type="text" id="location" onChange={handleInputChange}/>
      </div>
      <div className="form_item">
        <label htmlFor="description">Description</label>
        <input type="text" id="description" onChange={handleInputChange}/>
      </div>
      <div className="form_item">
        <Button onClick={handleUpload} text='Upload' />
      </div>
    </form>
  );
};

export default AddForm;
