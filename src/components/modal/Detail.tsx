import React from 'react';
import {IUploadedItem} from "../../type/type";
import {last} from "../../utils/misc";
import moment from "moment";
import {firstLetterUppercase} from "@geonil2/util-func";

const Detail = ({item}: {item?: IUploadedItem}) => {
  const {tokenId, ownerHistory, photo, location, description, timestamp} = item!
  const originalOwner = ownerHistory[0]
  const currentOwner = last(ownerHistory)
  const issueDate = moment.unix(Number(timestamp)).format('MMMM Do YYYY, h:mm A')

  return (
    <div className="detail_modal">
      <section className="detail_section image">
        <img src={photo} alt="nft"/>
      </section>
      <section className="detail_section info">
        <div className="detail_top">
          <h4 className="token_id">#{tokenId}</h4>
          <span className="location">at {firstLetterUppercase(location)}</span>
        </div>
        <div className="detail_mid">
          <div className="detail_item">
            <span className="detail_key">Owned By</span>
            <span className="detail_value">{currentOwner}</span>
          </div>
          <div className="detail_item">
            <span className="detail_key">Created By</span>
            <span className="detail_value">{originalOwner}</span>
          </div>
          <div className="detail_item">
            <span className="detail_key">Description</span>
            <span className="detail_value description">{description}</span>
          </div>
          <div className="detail_item">
            <span className="detail_key">Created At</span>
            <span className="detail_value">{issueDate}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Detail;
