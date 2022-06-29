import React from 'react';
import Card from "./Card";
import {IUploadedItem} from "../type/type";

const ListLayout = ({list}: {list: IUploadedItem[]}) => {

  const orderList = (list: IUploadedItem[]) => {
    const updated = [...list]
    updated.sort((itemA, itemB) => {
      return Number(itemB.timestamp) - Number(itemA.timestamp)
    })
    return updated
  }

  return (
    <ul className="feed_list">
      {orderList(list).map((item: IUploadedItem) =>
      <Card item={item} key={item.timestamp}/>
      )}
    </ul>
  );
};

export default ListLayout;
