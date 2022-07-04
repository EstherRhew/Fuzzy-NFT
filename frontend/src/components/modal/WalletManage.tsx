import React, {useEffect, useState} from 'react';
import {useRecoilState} from "recoil";
import {accountAtom} from "../../recoil/account";
import {profileAtom} from "../../recoil/profile";

const WalletManage = ({addWalletAccount} : {addWalletAccount?: (arg: string) => void}) => {
  const [account, setAccount] = useRecoilState(accountAtom)
  const [profile, setProfile] = useRecoilState(profileAtom)

  const onClickAdd = async (e: any) => {
    e.preventDefault()
    if (!addWalletAccount) {
      return;
    }

    await addWalletAccount(account)
  }

  useEffect(() => {
    console.log(profile)
  }, [profile])
  return (
    <div className="wallet_modal">
      <h4>지갑계정관리</h4>
      <ul className="wallet_list">
        <li>
          {/*<span>계정별칭</span>*/}
          <span>주소</span>
          <span></span>
        </li>
        {profile!.walletAddress.map((address) =>
        <li>
          <span>{address}</span>
          <button>삭제</button>
        </li>
        )}


      </ul>
      <form className="wallet_to_add">
        <div className="input_item">
          <label htmlFor="account">현재 Kaikas 지갑에 연결 된 계정주소</label>
          <input id="account" type="text" value={account} readOnly={true}/>
          <span className="warning">이미 추가 된 계정입니다.</span>
        </div>
        <button onClick={onClickAdd} className="btn">계정 추가</button>
      </form>

    </div>
  );
};

export default WalletManage;
