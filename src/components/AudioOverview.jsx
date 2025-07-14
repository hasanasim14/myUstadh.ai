import React, { useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import './CardThree.css';
import './AudioOverview.css'; 

const AudioOverview = ({ selectedDocs }) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const languages = ['English', 'Urdu', 'Punjabi', 'Sindhi', 'Pashto'];

  // this function handles the selection of a language from the dropdown menu
  // it updates the selectedLanguage state and closes the menu
  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setShowLanguageMenu(false);
  };

  // this function handles the click event for generating the podcast
  // it sends a POST request to the backend with the selected language and documents
  const handleGenerateClick = async () => {
    setLoading(true);
    setError(null);
    setAudioUrl(null); // reset

    try {
      const response = await fetch('http://127.0.0.1:8000/podcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: selectedLanguage,
          selectedDocs,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Podcast generation response:', data);
      setAudioUrl(data.audio_url); // set URL returned by API
    } catch (err) {
      console.error('Failed to generate podcast:', err);
      setError(err.message || 'Failed to generate podcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="audio-overview">
      <div className="audio-header" style={{ position: 'relative' }}>
        <span className="audio-title">Audio Overview</span>
        <FiInfo
          className="info-icon"
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          style={{ cursor: 'pointer' }}
        />
        {showLanguageMenu && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              padding: '8px',
              zIndex: 100,
              borderRadius: '4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ marginBottom: '4px', fontWeight: 'normal', fontSize: '12px' }}>
              Select Language:
            </div>
            {languages.map((lang) => (
              <div
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                style={{
                  cursor: 'pointer',
                  padding: '4px 0',
                  fontSize: '11px',
                  fontWeight: lang === selectedLanguage ? 'bold' : 'normal',
                  color: lang === selectedLanguage ? '#007bff' : 'inherit',
                }}
              >
                {lang}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="load-box">
        <span className="load-text">Click to generate the podcast.</span>
        <button
          className="load-button"
          onClick={handleGenerateClick}
          disabled={loading}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner" />
            </div>
          ) : (
              'Generate'
        )}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginTop: '8px' }}>{error}</div>}

      {audioUrl && (
        <div style={{ marginTop: '16px' }}>
          <audio controls src={audioUrl} style={{ width: '100%' }}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioOverview;
