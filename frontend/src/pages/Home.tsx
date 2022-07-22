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

const observerOptions = {
  root: null,
  threshold: 1.0
}

const Home = () => {
  const [list, setList] = useRecoilState(listAtom)
  const [modal, setModal] = useRecoilState(modalAtom)
  const [loading, setLoading] = useState(false)
  const profile = useRecoilValue(profileAtom)
  const setAccount = useSetRecoilState(accountAtom)
  const loginToken = useRecoilValue(loginTokenAtom)
  const loadingRef = useRef<HTMLDivElement>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [allLoaded, setAllLoaded] = useState(false)

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

  const checkAllLoaded = async () => {
    const totalCount = await getTotalCount();
    if (list.length == totalCount) {
      setAllLoaded(true)
    }
  }

  const handleObserver = async (entries: any) => {
    const loadingSpinner = entries[0];
    if (loadingSpinner.isIntersecting && !loading) {
      setPageIndex(index => index + 1)
    }
  }

  const loadMoreItems = async () => {
    setLoading(true)
    const loadedMoreList = await getAllList(pageIndex)
    setList(list => list.concat(loadedMoreList))
    setLoading(false)
  }

  useEffect(() => {
    checkAllLoaded()
  }, [list])

  useEffect(() => {
    if (pageIndex === 0 || allLoaded) {
      return;
    }

    loadMoreItems()
  }, [pageIndex])


  useEffect(() => {
    if (loginToken === '') {
      return;
    }
    setLoading(true)

    getAllList(0)
      .then(setList)
      .then(() => setLoading(false))
  }, [loginToken])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, observerOptions)
    if (loadingRef.current) observer.observe(loadingRef.current)

    if (allLoaded) {
      observer.disconnect()
    }
    return () => observer.disconnect()
  }, [handleObserver])

  return (
    <>
      <Header/>
      <main className="home">
        <Button onClick={onClickAdd} text='Add' icon={addIcon}/>
        <ListLayout list={list} loading={loading} ref={loadingRef} allLoaded={allLoaded}/>
        {modal === 'AddForm' && <Modal type='addForm'/>}
        {modal === 'Login' && <Modal type='login'/>}
      </main>
    </>
  );
};

export default Home;


// const loadMoreItems = async () => {
//   const loadedMoreList = await getAllList(lastIndexRef.current)
//   const updated = list.concat(loadedMoreList)
//   console.log(list)
//   console.log(updated)
//   setList(list => list.concat(loadedMoreList))
//   setLastIndex(lastIndexRef.current - LIMIT)
// }

// const handleScroll = _.debounce(async () => {
//   // console.log(lastIndexRef.current, 'llll')
//   if (lastIndexRef.current <= 0) {
//     window.removeEventListener("scroll", handleScroll)
//   }
//   const scrollHeight = document.documentElement.scrollHeight;
//   const scrollTop = document.documentElement.scrollTop;
//   const clientHeight = document.documentElement.clientHeight;
//   if (scrollTop + clientHeight >= scrollHeight && !loading) {
//     setLoading(true)
//     await loadMoreItems()
//     setLoading(false)
//   }
// }, 1000)

// useEffect(() => {
//   // getTotalCount()
//   //   .then((totalCount) => {
//   //     setLastIndex(totalCount - LIMIT)
//   //   })
//
//   window.addEventListener("scroll", handleScroll)
//
//   return () => window.removeEventListener("scroll", handleScroll)
// }, [])

// const setLastIndex = (index: number) => {
//   lastIndexRef.current = index;
//   _setLastIndex(index)
// }
