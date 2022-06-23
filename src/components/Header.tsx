import React from 'react';
import Button from "./Button";
import {klaytn} from "../klaytn/caver";
import {useRecoilState} from "recoil";
import {accountAtom} from "../recoil/account";
import walletIcon from '../assets/image/icon-wallet.png'
import logoutIcon from '../assets/image/icon-logout.png'
import {shortCutAddress} from "@geonil2/util-func";

const Header = () => {
  const [account, setAccount] = useRecoilState(accountAtom)

  const onLogin = async () => {
    const accounts = await klaytn.enable()
    const account = accounts[0]
    setAccount(account)
  }

  const onLogout = () => {

  }

  return (
    <header className="header">
      <section className="header_left">logo</section>
      <section className="header_right">

            <Button onClick={onLogin} text='Login' icon={walletIcon}/>
            <span>{shortCutAddress(account)}</span>

            <Button onClick={onLogout} text="Logout" icon={logoutIcon}/>
            <span>Logout</span>

      </section>
    </header>
  );
};

export default Header;
