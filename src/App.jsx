import { useState } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import CardOne from "./components/CardOne";
import CardTwo from "./components/CardTwo";
import CardThree from "./components/CardThree";
import Navbar from "./components/Header";
// import OtherPage from "./components/OtherPage"; // Example of another route
import MarkdownViewer from "./components/MarkdownViewer";

export default function App() {
  const location = useLocation();
  const isMainApp = location.pathname === "/" || location.pathname === "/app"; // Adjust to your main route

  const [tab, setTab] = useState("content");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [notes, setNotes] = useState([]);

  const handleAddPinnedNote = (question, answer) => {
    const newNote = {
      title: `Pinned: ${question.slice(0, 30)}...`,
      content: answer,
      editable: false,
    };
    setNotes((prev) => [...prev, newNote]);
  };

  if (!isMainApp) {
    // For other routes like "/about", "/contact", etc.
    return <MarkdownViewer />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Mobile layout */}
      <div className="flex-1 overflow-y-auto md:hidden">
        {tab === "content" && (
          <CardOne
            selectedDocs={selectedDocs}
            setSelectedDocs={setSelectedDocs}
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
          />
        )}
      </div>

      <div className="md:hidden sticky bottom-0 z-10 bg-white">
        <BottomNav currentTab={tab} setTab={setTab} />
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex md:flex-1 md:flex-col p-4">
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-3">
            <CardOne
              selectedDocs={selectedDocs}
              setSelectedDocs={setSelectedDocs}
            />
          </div>
          <div className="col-span-6">
            <CardTwo
              onPinNote={handleAddPinnedNote}
              selectedDocs={selectedDocs}
            />
          </div>
          <div className="col-span-3">
            <CardThree
              selectedDocs={selectedDocs}
              notes={notes}
              setNotes={setNotes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
