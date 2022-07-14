import React, {useEffect} from 'react';
import Button from "./Button";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {accountAtom} from "../recoil/account";
import {loginStatusAtom, loginTokenAtom, profileAtom} from '../recoil/profile'
import walletIcon from '../assets/image/icon-wallet.png'
import logoutIcon from '../assets/image/icon-logout.png'
import logo from '../assets/image/logo.png'
import {Link} from "react-router-dom";
import {modalAtom} from "../recoil/modal";
import Search from "./Search";


const Header = () => {
  const [account, setAccount] = useRecoilState(accountAtom)
  const [profile, setProfile] = useRecoilState(profileAtom)
  const setLoginToken = useSetRecoilState(loginTokenAtom)

  const onLogout = () => {
    setProfile(undefined)
    setLoginToken('')
  }

  // useEffect(() => {
  //   console.log(profile, 'profile')
  // }, [profile])

  return (
    <header className="header">
      <section className="header_left">
        <Link to={'/'}>
          <img src={logo} alt="logo"/>
          <span>Fuzzy</span>
        </Link>
      </section>
      <section className="header_search">
        <Search/>
      </section>
      <section className="header_right">
            <Link to={`/${profile?.name}`}>
              <div className="menu_item">
                <Button onClick={() => {
                }} text="wallet" icon={walletIcon}/>
                <span>{profile?.name}</span>
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
