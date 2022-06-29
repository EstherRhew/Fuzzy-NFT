import React, {useEffect, useState} from 'react';
import ListLayout from "../components/ListLayout";
import {useRecoilState, useRecoilValue} from "recoil";
import {myListAtom} from "../recoil/list";

const MyPage = () => {
  const myList = useRecoilValue(myListAtom)
  return (
    <main className="mypage">
      <h4>My Photos</h4>
      <ListLayout list={myList} />
    </main>

  );
};

export default MyPage;
