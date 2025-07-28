import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";
import "./CardThree.css";
import "./AudioOverview.css";

const AudioOverview = ({ selectedDocs }) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const endpoint = import.meta.env.VITE_API_URL;

  const languages = ["English", "Urdu", "Punjabi", "Sindhi", "Pashto"];
  const sessionId = sessionStorage.getItem("session_id") || "";

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
      const response = await fetch(`${endpoint}/podcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          language: selectedLanguage,
          selectedDocs,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const audioObjectUrl = URL.createObjectURL(blob);
      setAudioUrl(audioObjectUrl);
    } catch (err) {
      console.error("Failed to generate podcast:", err);
      setError(err.message || "Failed to generate podcast");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="audio-overview">
      <div className="audio-header" style={{ position: "relative" }}>
        <span className="audio-title" style={{ fontSize: "13px" }}>
          Audio Overview
        </span>
        <FiInfo
          className="info-icon"
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          style={{ cursor: "pointer" }}
        />
        {showLanguageMenu && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              backgroundColor: "white",
              border: "1px solid #ccc",
              padding: "8px",
              zIndex: 100,
              borderRadius: "4px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                marginBottom: "4px",
                fontWeight: "normal",
                fontSize: "10px",
              }}
            >
              Select Language:
            </div>
            {languages.map((lang) => (
              <div
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                style={{
                  cursor: "pointer",
                  padding: "4px 0",
                  fontSize: "9px",
                  fontWeight: lang === selectedLanguage ? "bold" : "normal",
                  color: lang === selectedLanguage ? "#007bff" : "inherit",
                }}
              >
                {lang}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="load-box">
        <span className="load-text" style={{ fontSize: "11px" }}>
          Click to generate the podcast.
        </span>
        <button
          className="flex items-center justify-center bg-[#4259ff] text-white rounded-xl p-2 text-sm font-semibold cursor-pointer hover:bg-[#3a4bda] w-full"
          onClick={handleGenerateClick}
          disabled={loading}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="spinner" />
            </div>
          ) : (
            "Generate"
          )}
        </button>
      </div>

      {error && <div style={{ color: "red", marginTop: "8px" }}>{error}</div>}

      {audioUrl && (
        <div style={{ marginTop: "16px" }}>
          <audio controls src={audioUrl} style={{ width: "100%" }}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioOverview;
