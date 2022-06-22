import React from 'react';
import Card from "./Card";
import {IItem} from "../type/type";

const ListLayout = ({list}: {list: IItem[]}) => {
  return (
    <ul>
      {list.map(item =>
      <Card item={item}/>
      )}
    </ul>
  );
};

export default ListLayout;
