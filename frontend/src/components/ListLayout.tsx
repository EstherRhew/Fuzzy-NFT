import React, {forwardRef, useEffect, useState, useRef} from 'react';
import _ from "lodash";
import Card from "./Card";
import {IUploadedItem} from "../type/type";
import Spinner from '../assets/image/spinner-solid.svg'
import {useRecoilValue} from "recoil";
import {keywordAtom} from "../recoil/keyword";
import {last} from "../utils/misc";
import {getTotalCount} from "../service/contract";

const LIMIT = 5

const ListLayout =({list, loading}: { list: IUploadedItem[], loading: boolean}) => {
  const keyword = useRecoilValue(keywordAtom)
  const listLayoutRef = useRef<HTMLUListElement>(null)

  const orderList = (list: IUploadedItem[]) => {
    const updated = [...list]
    updated.sort((itemA, itemB) => {
      return Number(itemB.timestamp) - Number(itemA.timestamp)
    })
    return updated
  }

  const sortListByKeyword = (list: IUploadedItem[]) => {
    if (keyword === '') {
      return list
    }
    const updated = list.filter((item) => {
      const array =  Object.keys(item).map((key) => {
        if (key === 'ownerHistory') {
          const currentOwner = last(item[key])
          return currentOwner.includes(keyword)
        }

        return item[key].includes(keyword)
      })
      return array.includes(true)
    })
    return updated
  }




  return (
    loading
      ? <ul className="feed_list" ref={listLayoutRef}>
        <div className="loading">
          <img className="loading_spinner" src={Spinner} alt="spinner"/>
        </div>
      </ul>
      : list.length > 0
        ? <ul className="feed_list" ref={listLayoutRef}>
          {sortListByKeyword(orderList(list)).map((item: IUploadedItem) =>
            <Card item={item} key={item.timestamp}/>
          )}
          <div className="loading">
            <img className="loading_spinner" src={Spinner} alt="spinner"/>
          </div>
        </ul>
        : <ul className="feed_list" ref={listLayoutRef}>
          <p>No Items Found</p>
        </ul>
  );
};

export default ListLayout;
