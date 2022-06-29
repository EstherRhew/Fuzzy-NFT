import React from 'react';
import {IUploadedItem} from "../../type/type";
import {last} from "../../utils/misc";
import moment from "moment";
import {firstLetterUppercase} from "@geonil2/util-func";
import config from "../../config";
import closeIcon from "../../assets/image/xmark-solid.svg";
import {useRecoilState} from "recoil";
import {modalAtom} from "../../recoil/modal";

const Detail = ({item}: {item?: IUploadedItem}) => {
  const {tokenId, ownerHistory, photo, location, description, timestamp} = item!
  const originalOwner = ownerHistory[0]
  const currentOwner = last(ownerHistory)
  const issueDate = moment.unix(Number(timestamp)).format('MMMM Do YYYY, h:mm A')

  const [modal, setModal] = useRecoilState(modalAtom)

  const onCloseModal = () => {
    setModal('');
  }

  return (
    <div className="detail_modal">
      <section className="detail_section image">
        <img src={photo} alt="nft"/>
      </section>
      <section className="detail_section info">
        <img src={closeIcon} alt="" className="close_icon" onClick={onCloseModal}/>
        <div className="detail_top">
          <h4 className="token_id">#{tokenId}</h4>
          <span className="location">at {firstLetterUppercase(location)}</span>
        </div>
        <div className="detail_mid">
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
          <div className="detail_link">
            <a href={`${config.OPENSEA_URL}/${config.CONTRACT_ADDRESS}/${tokenId}`} target='_blank'>View on Opensea</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Detail;
