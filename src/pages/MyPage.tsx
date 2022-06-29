import React, {useEffect, useState} from 'react';
import ListLayout from "../components/ListLayout";
import {getMyList} from "../service";
import {IUploadedItem} from "../type/type";

const MyPage = () => {
  const [myList, setMyList] = useState<IUploadedItem[]>([])

  useEffect(() => {
    getMyList()
      .then(setMyList)
  },[])

  return (
    <main className="mypage">
      <h4>My Photos</h4>
      <ListLayout list={myList} />
    </main>

  );
};

export default MyPage;
