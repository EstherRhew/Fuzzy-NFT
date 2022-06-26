import React from 'react';
import {useRecoilState} from "recoil";
import {accountAtom, connectWallet, isStorageLoggedIn, storageStatusAtom} from "../recoil/account";

const LoginForm = () => {
  const [account, setAccount] = useRecoilState(accountAtom)
  const [storageStatus, setStorageStatus] = useRecoilState(storageStatusAtom)

  const onLogin = async (e: any) => {
    e.preventDefault()
    const account = await connectWallet()
    if (account) {

      setAccount(account)
      setStorageStatus(isStorageLoggedIn())
    }
  }
  return (
    <form className="login_form">
      <header className="login_form_header">Logo</header>
      <p>Get Started With Kaikas Wallet!</p>
      <button onClick={onLogin}>Connect Wallet</button>
    </form>
  );
};

export default LoginForm;
