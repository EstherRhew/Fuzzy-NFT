import React, {useEffect, useState} from 'react';
import Button from "../components/Button";
import ListLayout from "../components/ListLayout";
import {getAllList} from "../service";
import {useRecoilState} from "recoil";
import {ModalAtom} from "../recoil/modal";
import AddForm from "../components/AddForm";
import {IUploadedItem} from "../type/type";
import {klaytn} from "../klaytn/caver";
import {accountAtom} from "../recoil/account";
import {uploadIpfs} from "../ipfs/ipfs";
import addIcon from '../assets/image/plus-solid.svg'
import Modal from "../components/Modal";

const Home = () => {
  const [list, setList] = useState<IUploadedItem[]>([])
  const [modal, setModal] = useRecoilState(ModalAtom)
  const [account, setAccount] = useRecoilState(accountAtom)

  const onClickAdd = async () => {
    setModal(!modal)
  }

  useEffect(() => {
    getAllList()
      .then(setList)
  }, [])

  useEffect(() => {
    console.log(modal)
    console.log(account, 'account')
  }, [modal, account])

  return (
    <main className="home">
      <Button onClick={onClickAdd} text='Add' icon={addIcon}/>
      <ListLayout list={list} />
      {modal && <Modal /> }
    </main>
  );
};

export default Home;