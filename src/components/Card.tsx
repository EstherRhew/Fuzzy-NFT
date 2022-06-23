import React from 'react';
import {drawImageFromBytes} from "../utils/imageUtils";
import {last} from "../utils/misc";
import moment from "moment";
import transferIcon from '../assets/image/arrow-right-arrow-left-solid.svg'
import copyrightIcon from '../assets/image/copyright-solid.svg'
import {firstLetterUppercase, shortCutAddress} from "@geonil2/util-func";


const Card = ({item}: {item: any}) => {
  const {tokenId, ownerHistory, photo, title, location, description, timestamp} = item
  const originalOwner = ownerHistory[0]
  const currentOwner = last(ownerHistory)
  const imageUrl = drawImageFromBytes(photo)
  const issueDate = moment(timestamp * 1000).fromNow()

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
          <div className="icon"><img src={transferIcon} alt="transfer"/></div>
          <div className="icon"><img src={copyrightIcon} alt="copyright"/></div>
        </div>
      </section>
    </div>
  );
};

export default Card;

