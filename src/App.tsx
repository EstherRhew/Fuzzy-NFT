import React, {useEffect} from 'react';
import './assets/style/style.scss';
import Home from "./pages/Home";
import Header from "./components/Header";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
  accountAtom,
  isStorageLoggedIn,
  loginStatusAtom,
  onAccountsChanged,
  onUnlockAccount, storageStatusAtom,
  walletStatusAtom
} from "./recoil/account";
import {Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import {klaytn} from "./klaytn/caver";
import IndividualPage from "./pages/IndividualPage";
import {getAllList, getMyList} from "./service";
import {listAtom, myListAtom} from "./recoil/list";
import {IUploadedItem} from "./type/type";

function App() {
  const loginStatus = useRecoilValue(loginStatusAtom)
  const [account, setAccount] = useRecoilState(accountAtom)
  const [walletStatus, setWalletStatus] = useRecoilState(walletStatusAtom)
  const [storageStatus,setStorageStatus] = useRecoilState(storageStatusAtom)
  const [list, setList] = useRecoilState(listAtom)
  const [myList, setMyList] = useRecoilState(myListAtom)

  useEffect(() => {
    onUnlockAccount(setWalletStatus)
    setStorageStatus(isStorageLoggedIn())
    onAccountsChanged(setAccount)
  }, [])






  useEffect(() => {
    console.log(klaytn.selectedAddress, walletStatus, storageStatus, loginStatus, 'w-s-l')
  }, [walletStatus, storageStatus, loginStatus])

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/:account' element={<IndividualPage />} />
      </Routes>
      {/*{loginStatus ? <Home /> : <Login />}*/}
    </div>
  );
}

export default App;
