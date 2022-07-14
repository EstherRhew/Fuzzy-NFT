import React, {useEffect, useState} from 'react';
import Button from "../components/Button";
import ListLayout from "../components/ListLayout";
import {getAllList, getMyList} from "../service/contract";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {modalAtom} from "../recoil/modal";
import addIcon from '../assets/image/plus-solid.svg'
import Modal from "../components/modal/Modal";
import {listAtom, myListAtom} from "../recoil/list";
import {IUploadedItem} from "../type/type";
import {accountAtom, connectWallet} from "../recoil/account";
import {getUserData} from "../service/user";
import Header from "../components/Header";
import {loginTokenAtom, profileAtom} from "../recoil/profile";

const Home = () => {
  const [list, setList] = useRecoilState(listAtom)
  const [modal, setModal] = useRecoilState(modalAtom)
  const [loading, setLoading] = useState(false)
  const profile = useRecoilValue(profileAtom)
  const setAccount = useSetRecoilState(accountAtom)
  const loginToken = useRecoilValue(loginTokenAtom)

  const onClickAdd = async () => {
    const account = await connectWallet();
    if (!account) {
      return;
    }
    setAccount(account)

    if (!profile?.walletAddress.includes(account)) {
      alert('등록 안된 지갑계쩡')
      return;
    }
    setModal('AddForm')
  }

  useEffect(() => {
    if (loginToken === '') {
      return;
    }
    setLoading(true)
    getAllList(loginToken)
      .then(setList)
      .then(() => setLoading(false))
  }, [loginToken])

  return (
    <>
      <Header/>
      <main className="home">
        <Button onClick={onClickAdd} text='Add' icon={addIcon}/>
        <ListLayout list={list} loading={loading}/>
        {modal === 'AddForm' && <Modal type='addForm'/>}
        {modal === 'Login' && <Modal type='login'/>}
      </main>
    </>
  );
};

export default Home;
