import React, {useEffect, useState} from 'react';
import Button from "../components/Button";
import ListLayout from "../components/ListLayout";
import {getAllList} from "../service";
import {useRecoilState} from "recoil";
import {ModalAtom} from "../recoil/modal";
import AddForm from "../components/AddForm";
import {IItem} from "../type/type";
import {klaytn} from "../klaytn/caver";
import {accountAtom} from "../recoil/account";
import {uploadIpfs} from "../ipfs/ipfs";

const Home = () => {
  const [list, setList] = useState<IItem[]>([])
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
      <Button onClick={onClickAdd} text='Add'/>

      <ListLayout list={list} />
      {modal && <AddForm /> }
    </main>
  );
};

export default Home;
