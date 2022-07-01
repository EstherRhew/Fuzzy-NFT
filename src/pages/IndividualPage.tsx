import React, {useEffect, useState} from 'react';
import ListLayout from "../components/ListLayout";
import {useRecoilState, useRecoilValue} from "recoil";
import {myListAtom} from "../recoil/list";
import {getMyList} from "../service";
import {accountAtom} from "../recoil/account";
import {Link, useParams} from "react-router-dom";
import profileIcon from "../assets/image/user-solid.svg";
import {firstLetterUppercase} from "@geonil2/util-func";

const IndividualPage = () => {
  const [myList, setMyList] = useRecoilState(myListAtom)
  const {account} = useParams()
  // const account = useRecoilValue(accountAtom)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!account) {
      return;
    }
    setLoading(true)
    getMyList(account)
      .then(setMyList)
      .then(() => setLoading(false))
  },[account])

  return (
    <main className="mypage">
      <div className="profile">
        <img src={profileIcon} alt="" className="info_img sample"/>
        <div className="card_owner">
            <span className="account">
              {account}
            </span>
        </div>
      </div>
      <h4>Photos</h4>
      <ListLayout list={myList} loading={loading}/>
    </main>

  );
};

export default IndividualPage;
