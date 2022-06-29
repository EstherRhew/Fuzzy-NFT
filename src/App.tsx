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
import MyPage from "./pages/MyPage";

function App() {
  const loginStatus = useRecoilValue(loginStatusAtom)
  const [account, setAccount] = useRecoilState(accountAtom)
  const [walletStatus, setWalletStatus] = useRecoilState(walletStatusAtom)
  const [storageStatus,setStorageStatus] = useRecoilState(storageStatusAtom)

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
      {loginStatus && <Header />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/mypage' element={<MyPage />} />
      </Routes>
      {/*{loginStatus ? <Home /> : <Login />}*/}
    </div>
  );
}

export default App;
