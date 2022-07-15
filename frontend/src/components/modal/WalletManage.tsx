import React, {useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {accountAtom, walletUnlockStatusAtom} from "../../recoil/account";
import {loginTokenAtom, profileAtom} from "../../recoil/profile";
import {addWalletAddress, deleteWalletAddress, getUserData, getUserIdByAddress} from "../../service/user";
import closeIcon from "../../assets/image/xmark-solid.svg";
import {modalAtom} from "../../recoil/modal";

const WalletManage = () => {
  const [account, setAccount] = useRecoilState(accountAtom)
  const [profile, setProfile] = useRecoilState(profileAtom)
  const walletUnlockStatus = useRecoilValue(walletUnlockStatusAtom)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const setModal = useSetRecoilState(modalAtom)
  const loginToken = useRecoilValue(loginTokenAtom)

  const onClickAdd = async (e: any) => {
    e.preventDefault()

    if (addressAlreadyExists()) {
      setErrorMessage('이미 추가 된 주소입니다.')
      return;
    }

    const userId = await getUserIdByAddress(account)

    if (userId) {
      setErrorMessage('이미 다른 유저가 사용 중인 주소입니다.')
      return;
    }

    const res = await addWalletAddress(profile!.name, account, loginToken)
    if (!res) {
      return;
    }
    const userData = await getUserData(profile!.userId)
    setProfile(userData)
  }

  const onClickDelete = async (address: string) => {
    const res = await deleteWalletAddress(profile!.name, address, loginToken)
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
    setErrorMessage('')
  }, [account, profile])

  return (
    <div className="wallet_modal">
      <h4>
        지갑계정관리
        <img src={closeIcon} alt="" className="close_icon" onClick={onCloseModal}/>
      </h4>

      <ul className="wallet_list">
        <li className="wallet_item header" key="header">
          {/*<span>계정별칭</span>*/}
          <span>연동 된 주소</span>
          <span></span>
        </li>
        {profile!.walletAddress.map((address) =>
        <li className="wallet_item body" key="body">
          <span>{address}</span>
          <button onClick={() => onClickDelete(address)} className="btn delete">삭제</button>
        </li>
        )}
      </ul>

      <form className="wallet_to_add">

        <div className="input_item">
          <label htmlFor="account">현재 Kaikas 지갑에 로그인 된 계정주소</label>
          {walletUnlockStatus
            ? <input id="account" className={errorMessage !== '' ? 'input_disabled' : ''} type="text" value={account} readOnly={true}/>
            : <input id="account" className="input_disabled" type="text" value="🔒 현재 Kaikas 지갑이 잠금상태입니다. 잠금 해제 후 진행해주세요." readOnly={true}/>
          }
          <span className="warning">{errorMessage}</span>
        </div>
        <button onClick={onClickAdd} className="btn">계정 추가</button>
      </form>

    </div>
  );
};

export default WalletManage;
