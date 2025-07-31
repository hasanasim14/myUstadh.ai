import React, { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import DocChat from "./DocChat";
import "./CardTwo.css";
import { Trash } from "lucide-react";

const CardTwo = ({ onPinNote, selectedDocs }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const isSession = localStorage.getItem("session_id");
    if (isSession) {
      setHasSession(true);
    }
    console.log("setting the session");
  }, []);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    localStorage.removeItem("session_id");
    // setHasSession(false);
  };

  return (
    <div className="h-[85vh] md:border md:rounded-lg border-gray-200">
      <div className="card-header">
        <span className="title">AI Chat</span>
        <div
          className="refresh-container hover:bg-gray-200 rounded-lg p-2 mr-2 cursor-pointer"
          onClick={() => {
            if (!hasSession || isLoading) return;
            handleRefresh();
          }}
          title={
            !hasSession
              ? "No session to clear"
              : isLoading
              ? "Please wait until response finishes"
              : "Clear chat session"
          }
        >
          <Trash className="refresh-icon" />
          <span className="refresh-text">Clear</span>
        </div>
      </div>
      <div className="card-content">
        <DocChat
          refreshTrigger={refreshTrigger}
          onPinNote={onPinNote}
          selectedDocs={selectedDocs}
          setIsLoading={setIsLoading}
        />
      </div>
    </div>
  );
};

export default CardTwo;
