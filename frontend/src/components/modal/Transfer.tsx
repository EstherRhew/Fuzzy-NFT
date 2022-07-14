import React, {useState} from 'react';
import {isAddress} from "../../utils/misc";
import closeIcon from "../../assets/image/xmark-solid.svg";
import {useRecoilState, useRecoilValue} from "recoil";
import {modalAtom} from "../../recoil/modal";
import {clickedAtom} from "../../recoil/clicked";
import {kaikasSelectedAddress} from "../../recoil/account";

const Transfer = ({transferItem}: {transferItem?: (arg: string) => void}) => {
  const [address, setAddress] = useState<string>('')
  const [validAddress, setValidAddress] = useState<boolean>(true)
  const [modal, setModal] = useRecoilState(modalAtom)
  const clicked = useRecoilValue(clickedAtom)

  const handleChange = (e:any) => {
    setValidAddress(true)
    setAddress(e.target.value)
  }

  const checkIsOwner = () => {
    const selected = kaikasSelectedAddress();
    // if (selected )
  }

  const handleTransfer = () => {
    if (!transferItem) {
      return;
    }

    const isValidAddress = isAddress(address)
    if (!isValidAddress) {
      setValidAddress(false)
      return;
    }

    transferItem(address)
  }

  const onCloseModal = () => {
    setModal('');
  }

  return (
    <div className="transfer_modal">
      <h4>
        <span>Transfer #{clicked} NFT </span>
        <img src={closeIcon} alt="" className="close_icon" onClick={onCloseModal}/>
      </h4>
      <div className="input_box">
        <label htmlFor="address">put the recipient's address here 🤗</label>
        <input type="text" id="address" value={address} onChange={handleChange}/>
        {!validAddress && <span className='error'>This is not a valid address! Please check again</span>}
      </div>
      <button className="btn" onClick={handleTransfer}>Transfer</button>
    </div>
  );
};

export default Transfer;
