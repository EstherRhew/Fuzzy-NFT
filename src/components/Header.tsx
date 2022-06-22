import React from 'react';
import Button from "./Button";
import {klaytn} from "../klaytn/caver";
import {useRecoilState} from "recoil";
import {accountAtom} from "../recoil/account";

const Header = () => {
  const [account, setAccount] = useRecoilState(accountAtom)

  const onLogin = async () => {
    const accounts = await klaytn.enable()
    const account = accounts[0]
    setAccount(account)
  }

  return (
    <header className="header">
      <section className="header_left">logo</section>
      <section className="header_right">
        <Button onClick={onLogin} text='Login'/>
      </section>
    </header>
  );
};

export default Header;
