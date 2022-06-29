import React, {useEffect, useState} from 'react';
import Button from "../components/Button";
import ListLayout from "../components/ListLayout";
import {getAllList} from "../service";
import {useRecoilState, useSetRecoilState} from "recoil";
import {ModalAtom} from "../recoil/modal";
import AddForm from "../components/modal/AddForm";
import {IUploadedItem} from "../type/type";
import {klaytn} from "../klaytn/caver";
import {
  accountAtom,
  isStorageLoggedIn,
  onAccountsChanged,
  onUnlockAccount,
  storageStatusAtom,
  walletStatusAtom
} from "../recoil/account";
import addIcon from '../assets/image/plus-solid.svg'
import Modal from "../components/modal/Modal";
import {listAtom} from "../recoil/list";

const Home = () => {
  const [list, setList] = useRecoilState(listAtom)
  const [modal, setModal] = useRecoilState(ModalAtom)
  const [account, setAccount] = useRecoilState(accountAtom)

  const onClickAdd = async () => {
    setModal('AddForm')
  }

  useEffect(() => {
    getAllList()
      .then(setList)
  }, [])


  return (
    <main className="home">
      <Button onClick={onClickAdd} text='Add' icon={addIcon}/>
      <ListLayout list={list} />
      {modal === 'AddForm' && <Modal type='addForm'/> }
    </main>
  );
};

export default Home;
