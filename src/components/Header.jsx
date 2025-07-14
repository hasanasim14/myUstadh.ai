import React from 'react';
import './Header.css';
import SearchBar from './SearchBar';
import NavLinks from './NavLinks';
import LanguageSelector from './LanguageSelector';
import Notifications from './Notifications';
import UserAvatar from './UserAvatar';

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-left">
        <div className="logo">myUstadh.ai</div>
        <SearchBar />
      </div>

      <div className="header-middle">
        <NavLinks />
      </div>

      <div className="header-right">
        <LanguageSelector />
        <Notifications />
        <UserAvatar />
      </div>
    </header>
  );
};

export default Header;
