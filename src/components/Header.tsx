import React, {useEffect} from 'react';
import Button from "./Button";
import {klaytn} from "../klaytn/caver";
import {useRecoilState} from "recoil";
import {accountAtom, connectWallet, disconnectWallet, isStorageLoggedIn, storageStatusAtom} from "../recoil/account";
import walletIcon from '../assets/image/icon-wallet.png'
import logoutIcon from '../assets/image/icon-logout.png'
import {shortCutAddress} from "@geonil2/util-func";
import {Link} from "react-router-dom";


const Header = () => {
  const [account, setAccount] = useRecoilState(accountAtom)
  const [storageStatus, setStorageStatus] = useRecoilState(storageStatusAtom)

  const onLogout = () => {
    disconnectWallet();
    setAccount('')
    setStorageStatus(isStorageLoggedIn())
  }

  return (
    <header className="header">
      <section className="header_left">
        <Link to={'/'}>logo</Link></section>
      <section className="header_right">
        <Link to={'/mypage'} >
        <div className="menu_item">
          <Button onClick={()=>{}} text="wallet" icon={walletIcon}/>
          <span>{shortCutAddress(account, 5)}</span>
        </div>
        </Link>
        <div className="menu_item">
          <Button onClick={onLogout} text="Logout" icon={logoutIcon}/>
          <span onClick={onLogout}>Logout</span>
        </div>
      </section>
    </header>
  );
};

export default Header;
