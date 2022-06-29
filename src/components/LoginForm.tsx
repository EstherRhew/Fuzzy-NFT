import React from 'react';
import {useRecoilState, useSetRecoilState} from "recoil";
import {accountAtom, connectWallet, isStorageLoggedIn, storageStatusAtom} from "../recoil/account";
import {modalAtom} from "../recoil/modal";

const LoginForm = () => {
  const [account, setAccount] = useRecoilState(accountAtom)
  const [storageStatus, setStorageStatus] = useRecoilState(storageStatusAtom)
  const setModal = useSetRecoilState(modalAtom)

  const onLogin = async (e: any) => {
    e.preventDefault()
    const account = await connectWallet()
    if (account) {
      setAccount(account)
      setStorageStatus(isStorageLoggedIn())
    }
    setModal('')
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
