import React, {useEffect, useRef, useState} from 'react';
import Button from "../components/Button";
import ListLayout from "../components/ListLayout";
import {getAllList, getMyList, getTotalCount} from "../service/contract";
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
import _ from "lodash";

const LIMIT = 5

const Home = () => {
  const [list, setList] = useRecoilState(listAtom)
  const [modal, setModal] = useRecoilState(modalAtom)
  const [loading, setLoading] = useState(false)
  const profile = useRecoilValue(profileAtom)
  const setAccount = useSetRecoilState(accountAtom)
  const loginToken = useRecoilValue(loginTokenAtom)
  const [lastIndex, _setLastIndex] = useState(0)
  const lastIndexRef = useRef(lastIndex)
  const [fetching, setFetching] = useState(false)

  const setLastIndex = (index: number) => {
    lastIndexRef.current = index;
    _setLastIndex(index)
  }

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



  const loadMoreItems = async () => {

    const loadedMoreList = await getAllList(lastIndexRef.current)
    setList(list => list.concat(loadedMoreList))
    setLastIndex(lastIndexRef.current - LIMIT)

  }

  const handleScroll = _.throttle(async () => {
    console.log(lastIndexRef.current, 'llll')
    if (lastIndexRef.current < (LIMIT - 1)) {
      window.removeEventListener("scroll", handleScroll)
    }
    const scrollHeight =  document.documentElement.scrollHeight;
    const scrollTop =  document.documentElement.scrollTop;
    const clientHeight =  document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight && fetching === false) {
      setFetching(true)
      await loadMoreItems()
      setFetching(false)
    }
  }, 1000)

  const getList = async (lastIndex: number) => {
    const list = await getAllList(lastIndex)
    setList(list)
  }


  useEffect(() => {
    setLoading(true)
    getTotalCount()
      .then((totalCount) => {
        setLastIndex(totalCount - LIMIT)
        getList(totalCount)
        window.addEventListener("scroll", handleScroll)
      })
      .then(() => {
        setLoading(false)
      })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // useEffect(() => {
  //   if (loginToken === '') {
  //     return;
  //   }
  //   setLoading(true)
  //
  //   console.log(lastIndex)
  //   getAllList(lastIndex)
  //     .then(setList)
  //     .then(() => setLoading(false))
  // }, [loginToken])

  return (
    <>
      <Header/>
      <main className="home">
        <Button onClick={onClickAdd} text='Add' icon={addIcon}/>
        <ListLayout list={list} loading={loading} />
        {modal === 'AddForm' && <Modal type='addForm'/>}
        {modal === 'Login' && <Modal type='login'/>}
      </main>
    </>
  );
};

export default Home;
