import React from 'react';

const Button = ({onClick, text}: {onClick: () => void, text: string}) => {
  return (
    <button className={`btn ${text}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
