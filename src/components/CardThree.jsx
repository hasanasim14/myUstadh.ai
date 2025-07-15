import React, { useState, useEffect, useRef } from "react";
import "./CardThree.css";
import { FiChevronRight, FiInfo, FiHeadphones } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import AudioOverview from "./AudioOverview";
import axios from "axios";
import MindmapModal from "./MindmapModal"; // adjust the path if needed

const CardThree = ({ notes, setNotes, selectedDocs }) => {
  // const [notes, setNotes] = useState([]);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditNoteIndex, setCurrentEditNoteIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentViewNote, setCurrentViewNote] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const audioRef = useRef(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  // states for the mindmap modal
  const [mindmapOpen, setMindmapOpen] = useState(false);
  const [mindmapMarkdown, setMindmapMarkdown] = useState("");
  const endpoint = import.meta.env.VITE_API_URL;

  // function added to fetch the mindmap from the backend when the user clicks on the Mind Map button
  const fetchMindmap = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${endpoint}/generate-mindmap`,
        {
          selectedDocs: selectedDocs,
        }
      );
      
      console.log("Mindmap response:", response.data);
      const markdownContent = response.data.markdown || "No mindmap available.";

      const newMindmapNote = {
        title: "Mind Map",
        content: markdownContent,
        editable: false,
        type: "mindmap",
      };

      setNotes((prevNotes) => [...prevNotes, newMindmapNote]);

      //
      setMindmapMarkdown(markdownContent);
      setMindmapOpen(true);
    } catch (error) {
      console.error(
        "Error generating mindmap",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // function added to play the audio of the note content when the user clicks on the headphone icon
  const playNoteAudioFromAPI = async (text, index) => {
    setClickedIndex(index);
    if (playingIndex === index) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingIndex(null);
      setClickedIndex(null);
      return;
    }

    try {
      const response = await fetch(`${endpoint}/generate-audio/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Once audio starts, show green
      audio.onplay = () => {
        setPlayingIndex(index);
        setClickedIndex(null);
      };

      // On end, revert to black
      audio.onended = () => {
        setPlayingIndex(null);
        setClickedIndex(null);
      };

      await audio.play();
    } catch (error) {
      console.error("Audio playback failed:", error);
      setPlayingIndex(null);
      setClickedIndex(null);
    }
  };

  // function added to handle the addition of a manual note when the user clicks on Add a Note button
  const handleAddNote = () => {
    const newNote = {
      title: `Note ${notes.length + 1}`,
      content: "New note content...",
      editable: true,
    };
    setNotes([...notes, newNote]);
  };

  // function added for showing the menu when the user clicks on the three dot icon on a manually added note. that shows the delete option
  const handleToggleMenu = (index) => {
    setMenuOpenIndex(menuOpenIndex === index ? null : index);
  };

  // function added to perform the functionality of deleting a manually added note
  const handleDeleteNote = (indexToDelete) => {
    const updatedNotes = notes.filter((_, i) => i !== indexToDelete);
    setNotes(updatedNotes);
    setMenuOpenIndex(null);
  };

  // this has been added to automatically close the menu showing the delete option when the user clicks outside anywhere on the screen
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close delete menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenIndex(null);
      }

      // Close view modal
      if (
        isViewModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setIsViewModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isViewModalOpen]);

  // function added that handles the click on a note, if the note is a mindmap, it opens the mindmap modal, if the note is editable, it opens the edit modal, otherwise it opens the view-only modal
  const handleNoteClick = (index) => {
    const note = notes[index];
    if (note.type === "mindmap") {
      setMindmapMarkdown(note.content);
      setMindmapOpen(true);
      return;
    }
    if (note.editable) {
      // open edit modal
      setCurrentEditNoteIndex(index);
      setEditTitle(note.title);
      setEditContent(note.content);
      setIsEditModalOpen(true);
    } else {
      // open view-only modal
      setCurrentViewNote(note);
      setIsViewModalOpen(true);
    }
  };

  // function added that handles the edit made to a manually added note in the modal
  const handleSaveEdit = () => {
    const updatedNotes = [...notes];
    updatedNotes[currentEditNoteIndex] = {
      ...updatedNotes[currentEditNoteIndex],
      title: editTitle,
      content: editContent,
    };
    setNotes(updatedNotes);
    setIsEditModalOpen(false);
  };

  const handleFetchAndAddNote = async (type) => {
    let contentEndpoint = "";

    if (type === "Study Guide") contentEndpoint = `${endpoint}/study-guide`;
    else if (type === "Briefing Doc")
      contentEndpoint = `${endpoint}/briefing-doc`;
    else if (type === "FAQ") contentEndpoint = `${endpoint}/faq`;
    else return;

    const titleEndpoint = `${endpoint}/get-note-title`;

    setLoading(true);

    try {
      // Fetch content
      const contentResponse = await fetch(contentEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedDocs }),
      });
      if (!contentResponse.ok)
        throw new Error(`Content API error: ${contentResponse.status}`);
      const content = await contentResponse.text();

      // Fetch dynamic title
      const titleResponse = await fetch(titleEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, selectedDocs }),
      });
      if (!titleResponse.ok)
        throw new Error(`Title API error: ${titleResponse.status}`);
      const rawTitle = await titleResponse.text();
      const titleData = rawTitle.replace(/^"(.*)"$/, "$1");
      console.log(`Dynamic title for ${type}:`, titleData);
      const newNote = {
        title: titleData,
        content: content || "No content available.",
        editable: false,
      };

      setNotes((prev) => [...prev, newNote]);
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const menuBtnStyle = {
    display: "block",
    width: "100%",
    background: "none",
    border: "none",
    outline: "none",
    padding: "4px 4px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "0.9rem",
    color: "#333",
  };

  return (
    <div className="card-three">
      <div className="card-header">
        <span className="title">Library</span>
        <span className="icon">
          <FiChevronRight />
        </span>
      </div>

      <div className="card-container">
        <AudioOverview selectedDocs={selectedDocs} />

        <div className="notes-section">
          <span className="section-title"  style={{fontSize: "13px"}}>Notes</span>
          <button className="add-note" onClick={handleAddNote}>
            + Add note
          </button>
          <div className="note-buttons">
            {["Study Guide", "Briefing Doc", "FAQ", "Mind Map"].map((type) => (
              <button
                key={type}
                className="note-btn"
                onClick={() => {
                  if (type === "Mind Map") {
                    fetchMindmap();
                  } else {
                    handleFetchAndAddNote(type);
                  }
                }}
              >
                {type}
              </button>
            ))}
          </div>
          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "10px",
                fontSize: "14px",
                color: "#555",
              }}
            >
              <div className="spinner" />
              Generating...
            </div>
          )}
          {/* Starting onwards here is the code of when the notes get created whenn you click on the add a note button and the functionality of it being edittable */}
          <div className="notes-scroll-container">
            {notes.map((note, index) => (
              <div
                key={index}
                className="note-text-block"
                onClick={() => handleNoteClick(index)} // ✅ Add this line
                style={{
                  position: "relative",
                  cursor: "pointer",
                  minHeight: "40px",
                  maxHeight: "55px",
                  overflow: "hidden",
                  paddingBottom: "10px",
                  paddingRight: "10px",
                  paddingLeft: "10px",
                }}
              >
                <div
                  className="note-text-title"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "210px", // adjust as needed
                      display: "inline-block",
                      verticalAlign: "middle",
                    }}
                  >
                    {note.title}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2px",
                      position: "relative",
                    }}
                  >
                    {/* The Headphone icon performs the functionality of reading out the content of the note aloud */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playNoteAudioFromAPI(note.content, index);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        color:
                          clickedIndex === index
                            ? "red"
                            : playingIndex === index
                            ? "green" // Currently playing
                            : "black", // Default
                        outline: "none",
                        marginRight: "2px",
                      }}
                    >
                      <FiHeadphones />
                    </button>
                    {/* The three dot icons expands to show the option of deleting the note incase the user no longer needs it */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMenu(index);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "15px",
                        float: "right",
                        marginTop: "-5px",
                        marginRight: "2px",
                        outline: "none",
                        color: "black",
                      }}
                    >
                      ⋮
                    </button>

                    {menuOpenIndex === index && (
                      <div
                        ref={menuRef}
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: 0,
                          backgroundColor: "white",
                          zIndex: 10,
                          minWidth: "120px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                          borderRadius: "5px",
                          padding: "2px",
                        }}
                      >
                        <button
                          style={menuBtnStyle}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(index);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  style={{ marginTop: "0px", color: "#555", fontSize: "12px" }}
                >
                  {note.editable ? (
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => (
                          <p
                            style={{
                              fontSize: "0.87rem",
                              color: "#334",
                              lineHeight: "1.4",
                              margin: 0,
                            }}
                            {...props}
                          />
                        ),
                      }}
                    >
                      {note.content}
                    </ReactMarkdown>
                  ) : (
                    <div>
                      {" "}
                      {note.content
                        .replace(/\\n/g, "\n")
                        .replace(/^"(.*)"$/, "$1")
                        .replace(/^["']|["']$/g, "")
                        .replace(/^#+\s*/gm, "")
                        .slice(0, 50)}
                      ...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{
              width: "500px",
              height: "500px",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              boxSizing: "border-box",
            }}
          >
            <h3>Edit Note</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Note Title"
              style={{
                width: "100%",

                marginLeft: "0px",
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                color: "black",
                boxSizing: "border-box",
              }}
              disabled={!notes[currentEditNoteIndex]?.editable}
            />
            <textarea
              rows="6"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Note Content"
              style={{
                width: "95%",
                height: "250px",
                backgroundColor: "white",
                color: "black",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
              disabled={!notes[currentEditNoteIndex]?.editable}
            />
            <div style={{ marginTop: "10px", textAlign: "right" }}>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{ marginRight: "10px", backgroundColor: "blue" }}
              >
                Cancel
              </button>
              {notes[currentEditNoteIndex]?.editable && (
                <button
                  onClick={handleSaveEdit}
                  style={{ backgroundColor: "green" }}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {isViewModalOpen && currentViewNote && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
            className="modal-content modal-scroll"
            style={{
              width: "600px",
              maxHeight: "80vh",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              overflowY: "auto",
              scrollbarGutter: "stable",
            }}
          >
            <h3 style={{ marginTop: 0 }}>{currentViewNote.title}</h3>
            <ReactMarkdown>
              {currentViewNote.content
                .replace(/\\n/g, "\n")
                .replace(/^"(.*)"$/, "$1")
                .replace(/^["']|["']$/g, "")}
            </ReactMarkdown>
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button
                onClick={() => setIsViewModalOpen(false)}
                style={{ backgroundColor: "blue" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <MindmapModal
        open={mindmapOpen}
        onClose={() => setMindmapOpen(false)}
        markdown={mindmapMarkdown}
      />
    </div>
  );
};
export default CardThree;
