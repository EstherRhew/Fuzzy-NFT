import React, {useEffect} from 'react';
import './assets/style/style.scss';
import Home from "./pages/Home";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
  accountAtom, isUnlocked,
  onAccountsChanged,
  walletUnlockStatusAtom,
} from "./recoil/account";
import {loginStatusAtom, tokenInStorage, loginTokenAtom, profileAtom,} from './recoil/profile'
import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import {checkTokenValidity, getUserData} from "./service/user";

function App() {
  const loginStatus = useRecoilValue(loginStatusAtom)
  const [account, setAccount] = useRecoilState(accountAtom)
  const [walletUnlockStatus, setWalletUnlockStatus] = useRecoilState(walletUnlockStatusAtom)
  const [loginToken, setLoginToken] = useRecoilState(loginTokenAtom)
  const setProfile = useSetRecoilState(profileAtom)

  const handleLogin = async (userId: string, token: string) => {
    const userData = await getUserData(userId, token)
    setProfile(userData)
  }

  const onUnlockAccount = () => {
    const loop = () => {
      setTimeout(async () => {
        const unlocked = await isUnlocked()
        // console.log(unlocked)
        setWalletUnlockStatus(unlocked)
        loop()
      }, 1500)
    }
    loop();
  }

  useEffect(() => {
    onUnlockAccount()
    onAccountsChanged(setAccount)
  }, [])

  useEffect(() => {
    if (tokenInStorage() === '' || tokenInStorage() == undefined) {
      return;
    }
    checkTokenValidity(tokenInStorage())
      .then((data) => {
        setLoginToken(tokenInStorage())
        handleLogin(data.decoded._id, tokenInStorage())
      })
      .catch((error) => {
        setLoginToken('')
      })
  }, [])

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={loginStatus ? <Home /> : <LoginPage />} />
        <Route path='/:userName' element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
