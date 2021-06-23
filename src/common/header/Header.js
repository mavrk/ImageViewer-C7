import React from 'react';
import './Header.css';

const Header=(props) => {
  return(
    <div>
        <header className="header">
        <h2 className="header-title">{props.title}</h2>
        </header>
    </div>
  );
}

export default Header;