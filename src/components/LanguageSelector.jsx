import React from 'react';
import './LanguageSelector.css';

const LanguageSelector = () => {
  return (
    <div className="language-selector">
      {/* You can replace the globe emoji with an actual SVG or icon as needed */}
      <span className="globe-icon">🌐</span>
      <span className="language-text">English</span>
    </div>
  );
};

export default LanguageSelector;
