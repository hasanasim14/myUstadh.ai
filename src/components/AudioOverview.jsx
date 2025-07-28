import React, { useEffect, useRef, useState } from "react";
import { FiInfo } from "react-icons/fi";
import "./CardThree.css";
import "./AudioOverview.css";

const AudioOverview = ({ selectedDocs }) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const pollingIntervalRef = useRef(null);
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
  const clearPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const pollForPodcast = (key) => {
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${endpoint}/fetch/podcast/${key}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok)
          throw new Error(`Polling failed: ${response.statusText}`);

        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("audio")) {
          const blob = await response.blob();
          const audioObjectUrl = URL.createObjectURL(blob);
          setAudioUrl(audioObjectUrl);
          setLoading(false);
          clearPolling();
          localStorage.removeItem("Key");
        } else {
          console.log("Audio not ready yet. Will retry...");
        }
      } catch (err) {
        console.error("Polling error:", err);
        setError("Failed to fetch podcast audio.");
        clearPolling();
        setLoading(false);
      }
    }, 30000); // every 30 seconds
  };

  const handleGenerateClick = async () => {
    localStorage.removeItem("Key"); // remove previous session key
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    clearPolling(); // just in case

    try {
      const response = await fetch(`${endpoint}/v1/podcast`, {
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

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const data = await response.json();
      const key = data?.data;
      if (!key) throw new Error("Invalid response from server.");

      localStorage.setItem("Key", key);
      pollForPodcast(key);
    } catch (err) {
      console.error("Failed to generate podcast:", err);
      setError(err.message || "Failed to generate podcast");
      setLoading(false);
    }
  };

  useEffect(() => {
    const key = localStorage.getItem("Key");
    if (key) {
      setLoading(true);
      pollForPodcast(key);
    }

    return () => clearPolling(); // clean up when component unmounts
  }, []);

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
          disabled={loading || selectedDocs.length === 0}
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
