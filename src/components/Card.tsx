import React, {useEffect, useState} from 'react';
import {drawImageFromBytes} from "../utils/imageUtils";
import {last, toChecksumAddress} from "../utils/misc";
import moment from "moment";
import transferIcon from '../assets/image/arrow-right-arrow-left-solid.svg'
import copyrightIcon from '../assets/image/copyright-solid.svg'
import {firstLetterUppercase, shortCutAddress} from "@geonil2/util-func";
import {getAllList, ownerOf, transferNft} from "../service";
import {useRecoilState, useRecoilValue} from "recoil";
import {accountAtom} from "../recoil/account";
import {listAtom} from "../recoil/list";
import Modal from "./modal/Modal";
import {ModalAtom} from "../recoil/modal";


const Card = ({item}: { item: any }) => {
  const {tokenId, ownerHistory, photo, location, description, timestamp} = item
  const originalOwner = ownerHistory[0]
  const currentOwner = last(ownerHistory)
  const imageUrl = photo
  const issueDate = moment(timestamp * 1000).fromNow()
  const account = useRecoilValue(accountAtom)
  const [list, setList] = useRecoilState(listAtom)
  const [owner, setOwner] = useState(currentOwner)
  const [clicked, setClicked] = useState(false)
  const [modal, setModal] = useRecoilState(ModalAtom)

  const onClickTransfer = () => {
    setClicked(!clicked)
    setModal('Transfer')
  }

  const transferItem = async (to: string) => {
    try {
      await transferNft(tokenId, to, account)
      setOwner(to)
    } catch (err) {
      console.error(`TransferNft failed to ${to}, ${err}`)
    } finally {
      setClicked(false)
    }
  }

  return (
    <>
      <div className="card">
        <section className="card_header">
          {/*<img src={imageUrl} alt="" className="info_img"/>*/}
          {/*<span className="card_id">#{tokenId}</span>*/}
          <div className="card_owner">
            <span className="info_account">{owner}</span>
            <span className="info_location">at {firstLetterUppercase(location)}</span>
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
            {toChecksumAddress(currentOwner) === toChecksumAddress(account)
              && <div className="icon" onClick={onClickTransfer}>
                <img src={transferIcon} alt="transfer"/>
              </div>
            }
            <div className="icon"><img src={copyrightIcon} alt="copyright"/></div>
          </div>
        </section>
      </div>
      {modal === 'Transfer' && clicked && <Modal type="transfer" handler={transferItem}/>}

    </>
  );
};

export default Card;

