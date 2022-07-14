import React, {useState} from 'react';
import searchIcon from '../assets/image/search.png'
import xMarkIcon from '../assets/image/xmark-solid.svg'
import {useRecoilState} from "recoil";
import {keywordAtom} from "../recoil/keyword";

const Search = ({}) => {
  const [keyword, setKeyword] = useRecoilState<string>(keywordAtom)
  const [onFocus, setOnFocus] = useState<boolean>(false)

  return (
    <div className={`search input_box ${onFocus && 'focus'}`}>
      {!onFocus && <img src={searchIcon} alt="search_icon" className="search_icon"/>}
      <input
        type="text"
        className={`search_form `}
        placeholder="Search..."
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        onFocus={() => setOnFocus(true)}
        onBlur={() => setOnFocus(false)}
      />
      {onFocus && <img onClick={() => setKeyword('')} src={xMarkIcon} alt="delete_icon" className="delete_icon"/>}
    </div>
  );
};

export default Search;
