import React from 'react';
import AddForm from "./AddForm";
import Transfer from "./Transfer";

const Modal = ({type, handler} : {type: string, handler?: (arg: string) => void}) => {
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
    default:
      return null;
  }

};

export default Modal;
