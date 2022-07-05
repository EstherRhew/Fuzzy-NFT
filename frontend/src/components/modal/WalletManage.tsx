import React, {useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {accountAtom, walletUnlockStatusAtom} from "../../recoil/account";
import {profileAtom} from "../../recoil/profile";
import {addWalletAddress, deleteWalletAddress, getUserData} from "../../service/user";
import closeIcon from "../../assets/image/xmark-solid.svg";
import {modalAtom} from "../../recoil/modal";

const WalletManage = () => {
  const [account, setAccount] = useRecoilState(accountAtom)
  const [profile, setProfile] = useRecoilState(profileAtom)
  const walletUnlockStatus = useRecoilValue(walletUnlockStatusAtom)
  const [alreadyExistAddress, setAlreadyExistAddress] = useState<boolean>(false)
  const setModal = useSetRecoilState(modalAtom)

  const onClickAdd = async (e: any) => {
    e.preventDefault()
    if (addressAlreadyExists()) {
      setAlreadyExistAddress(true)
      return;
    }

    const res = await addWalletAddress(profile!.name, account)
    if (!res) {
      return;
    }
    const userData = await getUserData(profile!.userId)
    setProfile(userData)
  }

  const onClickDelete = async (address: string) => {
    console.log(account, address)
    const res = await deleteWalletAddress(profile!.name, address)
    if (!res) {
      return;
    }
    const userData = await getUserData(profile!.userId)
    setProfile(userData)
  }

  const addressAlreadyExists = () => {
    return profile!.walletAddress.includes(account)
  }

  const onCloseModal = () => {
    setModal('');
  }

  useEffect(() => {
    setAlreadyExistAddress(false)
  }, [account, profile])

  return (
    <div className="wallet_modal">
      <h4>
        지갑계정관리
        <img src={closeIcon} alt="" className="close_icon" onClick={onCloseModal}/>
      </h4>

      <ul className="wallet_list">
        <li className="wallet_item header">
          {/*<span>계정별칭</span>*/}
          <span>연동 된 주소</span>
          <span></span>
        </li>
        {profile!.walletAddress.map((address) =>
        <li className="wallet_item body">
          <span>{address}</span>
          <button onClick={() => onClickDelete(address)} className="btn delete">삭제</button>
        </li>
        )}
      </ul>

      <form className="wallet_to_add">

        <div className="input_item">
          <label htmlFor="account">현재 Kaikas 지갑에 로그인 된 계정주소</label>
          {walletUnlockStatus
            ? <input id="account" className={alreadyExistAddress ? 'input_disabled' : ''} type="text" value={account} readOnly={true}/>
            : <input id="account" className="input_disabled" type="text" value="🔒 현재 Kaikas 지갑이 잠금상태입니다. 잠금 해제 후 진행해주세요." readOnly={true}/>
          }

          {alreadyExistAddress && <span className="warning">이미 추가 된 계정입니다.</span>}
        </div>
        <button onClick={onClickAdd} className="btn">계정 추가</button>
      </form>

    </div>
  );
};

export default WalletManage;
