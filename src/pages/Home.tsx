import React, {useEffect, useState} from 'react';
import Button from "../components/Button";
import ListLayout from "../components/ListLayout";
import {getAllList, getMyList} from "../service";
import {useRecoilState, useRecoilValue} from "recoil";
import {modalAtom} from "../recoil/modal";
import addIcon from '../assets/image/plus-solid.svg'
import Modal from "../components/modal/Modal";
import {listAtom, myListAtom} from "../recoil/list";
import {IUploadedItem} from "../type/type";
import {accountAtom} from "../recoil/account";

const Home = () => {
  const [list, setList] = useRecoilState(listAtom)
  const [modal, setModal] = useRecoilState(modalAtom)
  const [loading, setLoading] = useState(false)

  const onClickAdd = async () => {
    setModal('AddForm')
  }

  useEffect(() => {
    setLoading(true)
    getAllList()
      .then(setList)
      .then(() => setLoading(false))
  }, [])

  return (
    <main className="home">
      <Button onClick={onClickAdd} text='Add' icon={addIcon}/>
      <ListLayout list={list} loading={loading}/>
      {modal === 'AddForm' && <Modal type='addForm'/> }
      {modal === 'Login' && <Modal type='login'/> }
    </main>
  );
};

export default Home;
