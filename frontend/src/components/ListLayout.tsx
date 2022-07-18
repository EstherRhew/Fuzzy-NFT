import React, {forwardRef, useEffect, useState, useRef} from 'react';
import Card from "./Card";
import {IUploadedItem} from "../type/type";
import Spinner from '../assets/image/spinner-solid.svg'
import {useRecoilValue} from "recoil";
import {keywordAtom} from "../recoil/keyword";
import {last} from "../utils/misc";
import {useLocation} from "react-router-dom";

interface IProps {
  list: IUploadedItem[];
  loading: boolean;
  allLoaded?: boolean;
}

type LoadingRef = HTMLDivElement

const ListLayout = forwardRef<LoadingRef, IProps>(({list, loading, allLoaded}, loadingRef) => {
  const keyword = useRecoilValue(keywordAtom)
  const listLayoutRef = useRef<HTMLUListElement>(null)
  const {pathname} = useLocation()

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
      const array = Object.keys(item).map((key) => {
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
    loading && list.length === 0
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
          {!allLoaded && pathname === '/'
            && <div className="loading" ref={loadingRef}>
              <img className="loading_spinner" src={Spinner} alt="spinner"/>
            </div>
          }


        </ul>
        : <ul className="feed_list" ref={listLayoutRef}>
          <p>No Items Found</p>
        </ul>
  );
});

export default ListLayout;
