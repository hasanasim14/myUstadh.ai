import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import CardOne from "./components/CardOne";
import CardTwo from "./components/CardTwo";
import CardThree from "./components/CardThree";
import Navbar from "./components/Header";
import MarkdownViewer from "./components/MarkdownViewer";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const location = useLocation();
  const isMainApp = location.pathname === "/" || location.pathname === "/app";

  const [tab, setTab] = useState("content");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isThirdCardCollapsed, setIsThirdCardCollapsed] = useState(false);
  const [isFirstCardCollapsed, setIsFirstCardCollapsed] = useState(false);

  const handleRightCardCollapse = (collapsed) => {
    setIsThirdCardCollapsed(collapsed);
  };

  const handleLeftCardCollapse = (collapsed) => {
    setIsFirstCardCollapsed(collapsed);
  };

  const handleAddPinnedNote = (question, answer) => {
    const newNote = {
      title: `Pinned: ${question.slice(0, 30)}...`,
      content: answer,
      editable: false,
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const getCardWidths = () => {
    const leftCollapsed = isFirstCardCollapsed;
    const rightCollapsed = isThirdCardCollapsed;

    if (leftCollapsed && rightCollapsed) {
      return {
        cardOne: "basis-[5%]",
        cardTwo: "basis-[90%]",
        cardThree: "basis-[5%]",
      };
    } else if (leftCollapsed) {
      return {
        cardOne: "basis-[5%]",
        cardTwo: "basis-[70%]",
        cardThree: "basis-[25%]",
      };
    } else if (rightCollapsed) {
      return {
        cardOne: "basis-[25%]",
        cardTwo: "basis-[70%]",
        cardThree: "basis-[5%]",
      };
    } else {
      return {
        cardOne: "basis-[25%]",
        cardTwo: "basis-[50%]",
        cardThree: "basis-[25%]",
      };
    }
  };

  const { cardOne, cardTwo, cardThree } = getCardWidths();

  const renderMainApp = () => (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      {/* Mobile layout */}
      <div className="flex-1 overflow-y-auto md:hidden">
        {tab === "content" && (
          <CardOne
            selectedDocs={selectedDocs}
            setSelectedDocs={setSelectedDocs}
            onCollapseChange={handleLeftCardCollapse}
          />
        )}
        {tab === "chat" && (
          <CardTwo
            onPinNote={handleAddPinnedNote}
            selectedDocs={selectedDocs}
          />
        )}
        {tab === "library" && (
          <CardThree
            selectedDocs={selectedDocs}
            notes={notes}
            setNotes={setNotes}
            onCollapseChange={handleRightCardCollapse}
          />
        )}
      </div>

      <div className="md:hidden sticky bottom-0 z-10 bg-white">
        <BottomNav currentTab={tab} setTab={setTab} />
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex md:flex-1 md:flex-col p-4">
        <div className="flex gap-4 w-full">
          <div className={`${cardOne} transition-all duration-300 ease-in-out`}>
            <CardOne
              selectedDocs={selectedDocs}
              setSelectedDocs={setSelectedDocs}
              onCollapseChange={handleLeftCardCollapse}
            />
          </div>

          <div className={`${cardTwo} transition-all duration-300 ease-in-out`}>
            <CardTwo
              onPinNote={handleAddPinnedNote}
              selectedDocs={selectedDocs}
            />
          </div>

          <div
            className={`${cardThree} transition-all duration-300 ease-in-out`}
          >
            <CardThree
              selectedDocs={selectedDocs}
              notes={notes}
              setNotes={setNotes}
              onCollapseChange={handleRightCardCollapse}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route
        path="/"
        element={<ProtectedRoute>{renderMainApp()}</ProtectedRoute>}
      />
      <Route
        path="/app"
        element={<ProtectedRoute>{renderMainApp()}</ProtectedRoute>}
      />
      <Route
        path="/docs"
        element={
          <ProtectedRoute>
            <MarkdownViewer />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
