import React, {useEffect} from 'react';
import Button from "./Button";
import {klaytn} from "../klaytn/caver";
import {useRecoilState, useRecoilValue} from "recoil";
import {
  accountAtom,
  connectWallet,
  disconnectWallet,
  isStorageLoggedIn,
  loginStatusAtom,
  storageStatusAtom
} from "../recoil/account";
import walletIcon from '../assets/image/icon-wallet.png'
import logoutIcon from '../assets/image/icon-logout.png'
import {shortCutAddress} from "@geonil2/util-func";
import {Link} from "react-router-dom";
import {modalAtom} from "../recoil/modal";
import Search from "./Search";


const Header = () => {
  const [account, setAccount] = useRecoilState(accountAtom)
  const [storageStatus, setStorageStatus] = useRecoilState(storageStatusAtom)
  const loginStatus = useRecoilValue(loginStatusAtom)
  const [modal, setModal] = useRecoilState(modalAtom)

  const onLogout = () => {
    disconnectWallet();
    setAccount('')
    setStorageStatus(isStorageLoggedIn())
  }

  const onLogin = () => {
    setModal('Login')
  }

  return (
    <header className="header">
      <section className="header_left">
        <Link to={'/'}>logo</Link>
      </section>
      <section className="header_search">
        <Search />
      </section>
      <section className="header_right">
        <Link to={`/${account}`}>
          <div className="menu_item">
            <Button onClick={() => {
            }} text="wallet" icon={walletIcon}/>
            <span>{shortCutAddress(account, 5)}</span>
          </div>
        </Link>
        {!loginStatus
          ? <div className="menu_item">
            <Button onClick={onLogin} text="Login" icon={logoutIcon}/>
            <span onClick={onLogin}>Login</span>
          </div>
          : <div className="menu_item">
            <Button onClick={onLogout} text="Logout" icon={logoutIcon}/>
            <span onClick={onLogout}>Logout</span>
          </div>
        }

      </section>
    </header>
  );
};

export default Header;
