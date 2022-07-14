import React from 'react';
import AddForm from "./AddForm";
import Transfer from "./Transfer";
import Detail from "./Detail";
import {IUploadedItem} from "../../type/type";
import LoginForm from "../LoginForm";
import WalletManage from "./WalletManage";

const Modal = ({type, item, handler} : {type: string, item?:IUploadedItem, handler?: (arg: string) => void}) => {
  switch(type) {
    case 'addForm':
      return (
        <div className="modal">
          <AddForm />
        </div>
      );
    case 'transfer':
      return (
        <div className="modal">
          <Transfer transferItem={handler}/>
        </div>
      );
    case 'detail':
      return (
        <div className="modal">
          <Detail item={item}/>
        </div>
      )
    case 'login':
      return (
        <div className="modal">
          <LoginForm />
        </div>
      )
    case 'walletManage':
      return (
        <div className="modal">
          <WalletManage />
        </div>
      )
    default:
      return null;
  }

};

export default Modal;
