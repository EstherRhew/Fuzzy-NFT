import React from 'react';

const Button = ({onClick, text, icon}: {onClick: () => void, text: string, icon?: any}) => {
  return (
    <button className={`btn ${text}`} onClick={onClick}>
      {icon
        ? <img src={icon} alt="icon"/>
        : text
      }
    </button>
  );
};

export default Button;
