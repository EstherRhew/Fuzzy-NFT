import React from 'react';

const Button = ({onClick, text, icon}: {onClick: (e?:any) => void, text: string, icon?: any}) => {
  return (
    <button className={`btn ${text}`} onClick={onClick}>
      {icon
        ? <img src={icon} alt={text}/>
        : text
      }
    </button>
  );
};

export default Button;
