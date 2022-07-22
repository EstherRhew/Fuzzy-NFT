import React, {useEffect, useState} from 'react';
import {IUploadedItem} from "../../type/type";
import {last, toChecksumAddress} from "../../utils/misc";
import moment from "moment";
import {firstLetterUppercase} from "@geonil2/util-func";
import config from "../../config";
import closeIcon from "../../assets/image/xmark-solid.svg";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {modalAtom} from "../../recoil/modal";
import transferIcon from "../../assets/image/arrow-right-arrow-left-solid.svg";
import {IProfile, loginTokenAtom, profileAtom} from "../../recoil/profile";
import {accountAtom} from "../../recoil/account";
import {clickedAtom} from "../../recoil/clicked";
import {getUserData, getUserIdByAddress} from "../../service/user";
import profileIcon from "../../assets/image/user-solid.svg";

const Detail = ({item}: {item?: IUploadedItem}) => {
  const {tokenId, ownerHistory, photo, location, description, timestamp} = item!
  const originalOwner = ownerHistory[0]
  const currentOwner = last(ownerHistory)
  const issueDate = moment.unix(Number(timestamp)).format('MMMM Do YYYY, h:mm A')
  const [modal, setModal] = useRecoilState(modalAtom)
  const profile = useRecoilValue(profileAtom);
  const account = useRecoilValue(accountAtom)
  const setClicked = useSetRecoilState(clickedAtom)
  const [ownerProfile, setOwnerProfile] = useState<IProfile>()
  const loginToken = useRecoilValue(loginTokenAtom)

  const getOwnerProfile = async () => {
    const userId = await getUserIdByAddress(currentOwner)
    const userData = await getUserData(userId)
    userData && setOwnerProfile(userData)
  }

  const checkIsOwner = () => {
    if (profile?.walletAddress.includes(currentOwner.toLowerCase())
      && toChecksumAddress(account) === toChecksumAddress(currentOwner)) {
      return true
    }
    return false
  }

  const onClickTransfer = () => {
    setClicked(tokenId.toString())
    setModal('Transfer')
  }

  const onCloseModal = () => {
    setModal('');
  }

  useEffect(() => {
    getOwnerProfile()
  }, [])

  return (
    <div className="detail_modal">
      <section className="detail_section image">
        <img src={photo} alt="nft"/>
      </section>
      <section className="detail_section info">
        <img src={closeIcon} alt="" className="close_icon" onClick={onCloseModal}/>
        <div className="detail_top">
          <img src={ownerProfile?.image ? ownerProfile.image : profileIcon} alt="" className={`info_img ${!ownerProfile?.image && 'sample'}`}/>
          <div className="detail_top_text">
            <h4 className="owner">{ownerProfile?.name}</h4>
            <span className="location">at {firstLetterUppercase(location)}</span>
            <div className="buttons">
              {checkIsOwner()
                && <div className="icon" onClick={onClickTransfer}>
                  <img src={transferIcon} alt="transfer"/>
                  <span>Transfer</span>
                </div>
              }
            </div>
          </div>

        </div>
        <div className="detail_mid">
          <h4 className="token_id">NFT #{tokenId}</h4>
          <div className="detail_item">
            <span className="detail_key">Owned by</span>
            <span className="detail_value">{currentOwner}</span>
          </div>
          <div className="detail_item">
            <span className="detail_key">Created by</span>
            <span className="detail_value">{originalOwner}</span>
          </div>
          <div className="detail_item description">
            <span className="detail_key">Description</span>
            <span className="detail_value">{description}</span>
          </div>
          <div className="detail_item date">
            <span className="detail_key">Created on</span>
            <span className="detail_value">{issueDate}</span>
          </div>
          {/*<div className="detail_link">*/}
          {/*  <a href={`${config.OPENSEA_URL}/${config.CONTRACT_ADDRESS}/${tokenId}`} target='_blank'>View on Opensea</a>*/}
          {/*</div>*/}
        </div>

      </section>

    </div>
  );
};

export default Detail;
