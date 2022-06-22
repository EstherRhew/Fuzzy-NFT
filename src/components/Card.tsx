import React from 'react';

const Card = ({item}: {item: any}) => {
  return (
    <div className="card">
      <section className="card_section">
          <img src="" alt="" className="info_img" />
          <div className="info_text">
            <span className="info_account">0x003423423</span>
            <span className="info_location">location</span>
          </div>
      </section>
      <section className="card_section image">
        <img src="" alt="" className="card_image"/>
      </section>
      <section className="card_section">
        <h3 className="card_title">Title</h3>
        <p className="card_description">description</p>
        <span className="card_time">1 minute ago</span>
        <div className="card_buttons">
          <button className="btn_icon"><img src="" alt=""/>btn</button>
        </div>
      </section>
    </div>
  );
};

export default Card;
