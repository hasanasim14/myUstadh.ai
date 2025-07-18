import { useState } from "react";
import BottomNav from "./components/BottomNav";
import CardOne from "./components/CardOne";
import CardTwo from "./components/CardTwo";
import CardThree from "./components/CardThree";
import Navbar from "./components/Header";

export default function App() {
  const [tab, setTab] = useState("content");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [notes, setNotes] = useState([]);

  const handleAddPinnedNote = (question, answer) => {
    const newNote = { question, answer };
    setNotes((prev) => [...prev, newNote]);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
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

        {/* Mobile bottom bar */}
        <div className="md:hidden sticky bottom-0 z-10 bg-white">
          <BottomNav currentTab={tab} setTab={setTab} />
        </div>

        {/* For Desktop*/}
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
    </>
  );
}
