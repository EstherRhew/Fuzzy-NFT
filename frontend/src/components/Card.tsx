import React, {useEffect, useState} from 'react';
import {last, linkToKlaytnScope, toChecksumAddress} from "../utils/misc";
import moment from "moment";
import {firstLetterUppercase} from "@geonil2/util-func";
import {transferNft} from "../service/contract";
import {useRecoilState, useRecoilValue} from "recoil";
import {accountAtom} from "../recoil/account";
import Modal from "./modal/Modal";
import {modalAtom} from "../recoil/modal";
import transferIcon from '../assets/image/arrow-right-arrow-left-solid.svg'
import copyrightIcon from '../assets/image/copyright-solid.svg'
import profileIcon from '../assets/image/user-solid.svg'
import {Link} from "react-router-dom";
import {clickedAtom} from "../recoil/clicked";
import {DEFAULT_PROFILE, IProfile, profileAtom} from "../recoil/profile";
import {getUserData, getUserIdByName} from "../service/user";



const Card = ({item}: { item: any }) => {
  const {ownerName, tokenId, ownerHistory, photo, location, description, timestamp} = item
  const originalOwner = ownerHistory[0]
  const currentOwner = last(ownerHistory)
  const imageUrl = photo
  const issueDate = moment(timestamp * 1000).fromNow()
  const account = useRecoilValue(accountAtom)
  const [owner, setOwner] = useState<IProfile>(DEFAULT_PROFILE)
  const [clicked, setClicked] = useRecoilState(clickedAtom)
  const [modal, setModal] = useRecoilState(modalAtom)
  const [copyright, setCopyright] = useState(false)
  const profile = useRecoilValue(profileAtom)

  const onClickTransfer = () => {
    setClicked(tokenId)
    setModal('Transfer')
  }

  const transferItem = async (to: string) => {
    try {
      await transferNft(tokenId, to, account)
      setOwner({...owner, name: to})
    } catch (err) {
      console.error(`TransferNft failed to ${to}, ${err}`)
    } finally {
      setModal('');
    }
  }

  const onClickImage = () => {
    setClicked(tokenId)
    setModal('Detail')
  }

  const checkIsOwner = () => {
    if (profile?.walletAddress.includes(currentOwner.toLowerCase())
      && toChecksumAddress(account) === toChecksumAddress(currentOwner)) {
      return true
    }
    return false
  }

  const getOwnerData = async () => {
    const userId = await getUserIdByName(ownerName);
    const userData = await getUserData(userId);
    userData && setOwner(userData)
  }

  useEffect(() => {
    getOwnerData()
  }, [])

  return (
    <>
      <div className="card">
        <section className="card_header">
          <img src={owner.image ? owner.image : profileIcon} alt="" className={`info_img ${!owner.image && 'sample'}`}/>
          <div className="card_owner">
            <span className="info_account">
              <Link to={`/${owner.name}`}>
              {owner.name}
                </Link>
            </span>
            <span className="info_location">at {firstLetterUppercase(location)}</span>
          </div>
        </section>
        <section className="card_image" onClick={onClickImage}>
          <img src={imageUrl} alt=""/>
        </section>
        <section className="card_footer">
          <p className="card_description">{description}</p>
          <span className="card_time">{issueDate}</span>
          <div className="card_info">
            {checkIsOwner()
              && <div className="icon" onClick={onClickTransfer}>
                <img src={transferIcon} alt="transfer"/>
              </div>
            }
            <div className="icon" onMouseOver={() => setCopyright(true)}
                 onMouseOut={() => setCopyright(false)}>
              <img src={copyrightIcon} alt="copyright"/>
              <div className={`copyright ${copyright && 'hover'}`}>
                    <h5 className="copyright_title">Copyright.#{tokenId}</h5>
                    <span className="copyright_date">
                      {issueDate}</span>
                    <div className="copyright_item">
                      <span className="copyright_key">Original Owner</span>
                      <span className="copyright_value">
                        <a href={linkToKlaytnScope('account', originalOwner)} target="_blank">{originalOwner}</a>
                      </span>
                    </div>
                    <div className="copyright_item">
                      <span className="copyright_key">Current Owner</span>
                      <span className="copyright_value">
                        <a href={linkToKlaytnScope('account', owner)} target="_blank">{currentOwner}</a>
                      </span>
                    </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {modal === 'Transfer' && clicked === tokenId && <Modal type="transfer" handler={transferItem}/>}
      {modal === 'Detail' && clicked === tokenId &&  <Modal type="detail" item={item}/>}
    </>
  );
};

export default Card;

