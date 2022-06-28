import React from 'react';
import {drawImageFromBytes} from "../utils/imageUtils";
import {last} from "../utils/misc";
import moment from "moment";
import transferIcon from '../assets/image/arrow-right-arrow-left-solid.svg'
import copyrightIcon from '../assets/image/copyright-solid.svg'
import {firstLetterUppercase, shortCutAddress} from "@geonil2/util-func";
import {transferNft} from "../service";
import {useRecoilValue} from "recoil";
import {accountAtom} from "../recoil/account";


const Card = ({item}: {item: any}) => {
  const {tokenId, ownerHistory, photo, location, description, timestamp} = item
  const originalOwner = ownerHistory[0]
  const currentOwner = last(ownerHistory)
  const imageUrl = photo
  const issueDate = moment(timestamp * 1000).fromNow()
  const account = useRecoilValue(accountAtom)

  const handleTransfer = async (to: string) => {
    await transferNft(tokenId, to, account)
  }

  return (
    <div className="card">
      <section className="card_header">
          <img src={imageUrl} alt="" className="info_img" />
          <div className="card_owner">
            <span className="info_account">{shortCutAddress(currentOwner, 5)}</span>
            <span className="info_location">{firstLetterUppercase(location)}</span>
          </div>
      </section>
      <section className="card_image">
        <img src={imageUrl} alt=""/>
      </section>
      <section className="card_footer">
        {/*<h3 className="card_title">{title}</h3>*/}
        <p className="card_description">{description}</p>
        <span className="card_time">{issueDate}</span>
        <div className="card_info">
          <div className="icon" onClick={() => handleTransfer('0xf2abC6d777cB4400F7D6bDB7c3f5F147330f358C')}><img src={transferIcon} alt="transfer"/></div>
          <div className="icon"><img src={copyrightIcon} alt="copyright"/></div>
        </div>
      </section>
    </div>
  );
};

export default Card;

