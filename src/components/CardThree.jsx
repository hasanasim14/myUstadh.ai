import React, { useState, useEffect, useRef } from "react";
import "./CardThree.css";
import {
  FiChevronRight,
  FiInfo,
  FiHeadphones,
  FiChevronLeft,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import AudioOverview from "./AudioOverview";
import axios from "axios";
import MindmapModal from "./MindmapModal";
import {
  ChevronRight,
  Edit,
  FileText,
  GraduationCap,
  MessageSquareText,
  Network,
  Plus,
} from "lucide-react";
import remarkGfm from "remark-gfm";

const CardThree = ({ notes, setNotes, selectedDocs, onCollapseChange }) => {
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const endpoint = import.meta.env.VITE_API_URL;

  // better formatting for markdown
  const renderers = {
    h4: ({ children }) => (
      <h4 style={{ fontWeight: "bold", marginTop: "1.5rem" }}>{children}</h4>
    ),
    p: ({ children }) => (
      <p style={{ marginBottom: "1rem", lineHeight: 1.6 }}>{children}</p>
    ),
  };

  const noteTypes = [
    { label: "Study Guide", icon: GraduationCap },
    { label: "Briefing Doc", icon: FileText },
    { label: "FAQ", icon: MessageSquareText },
    { label: "Mind Map", icon: Network },
  ];

  // function added to fetch the mindmap from the backend when the user clicks on the Mind Map button
  const fetchMindmap = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${endpoint}/generate-mindmap`, {
        selectedDocs: selectedDocs,
      });

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

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newCollapsed = !prev;
      if (onCollapseChange) {
        onCollapseChange(newCollapsed);
      }
      return newCollapsed;
    });
  };

  return (
    // <div className="h-[85vh] md:border md:rounded-lg border-gray-200">
    <div
      className={`h-[85vh] md:border md:rounded-lg border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ml-auto ${
        isCollapsed ? "w-15" : "w-full"
      }`}
    >
      {isCollapsed ? (
        <div className="flex justify-center p-3 border-b border-gray-200">
          {/* // <div className="flex justify-end p-2"> */}
          <button
            className="cursor-pointer p-2 rounded-lg hover:bg-gray-200 text-[#64748b]"
            onClick={toggleCollapse}
          >
            {/* <ChevronRight /> */}
            <FiChevronLeft />
            {/* {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />} */}
          </button>
        </div>
      ) : (
        <>
          <div className="card-header">
            {/* <div className="flex justify-center pt-4"> */}
            <span className="title">Library</span>
            {/* <span className="icon"> */}
            <button
              className="cursor-pointer p-2 m-2 rounded-lg hover:bg-gray-200 text-[#64748b]"
              // onClick={() => setIsCollapsed((prev) => (prev === 1 ? 0 : 1))}
              onClick={toggleCollapse}
            >
              <FiChevronRight />
            </button>
            {/* </span> */}
          </div>

          <div className="card-container">
            <AudioOverview selectedDocs={selectedDocs} />

            <div className="notes-section">
              <span className="section-title" style={{ fontSize: "13px" }}>
                Notes
              </span>
              <button
                className="library-button w-full mb-2"
                onClick={handleAddNote}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add note
              </button>

              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                {noteTypes.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    className="library-button w-[calc(50%-4px)]"
                    onClick={() => {
                      if (label === "Mind Map") {
                        fetchMindmap();
                      } else {
                        handleFetchAndAddNote(label);
                      }
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
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
              <div className="notes-scroll-container border-t border-gray-200 px-1 py-4">
                {notes.map((note, index) => (
                  <div
                    key={index}
                    className="note-text-block border border-gray-100 rounded-lg mb-3"
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
                    {/* <div
                      className="note-text-title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        // alignItems: "center",
                      }}
                    > */}
                    <div className="flex justify-between items-center pb-2 font-semibold">
                      <span
                        style={{
                          // fontSize: "13px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "210px",
                          display: "inline-block",
                          verticalAlign: "middle",
                        }}
                      >
                        {note.title}
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          className="bg-transparent cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            playNoteAudioFromAPI(note.content, index);
                          }}
                          style={{
                            color:
                              clickedIndex === index
                                ? "red"
                                : playingIndex === index
                                ? "green"
                                : "black",
                            outline: "none",
                          }}
                        >
                          <FiHeadphones />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleMenu(index);
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "18px",
                            outline: "none",
                            color: "black",
                            lineHeight: "1",
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
                      style={{
                        marginTop: "0px",
                        color: "#555",
                        fontSize: "12px",
                      }}
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
                <h1 className="flex items-center gap-2 mb-4">
                  <Edit className="h-4 w-4" /> Edit Note
                </h1>
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
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-700 transition cursor-pointer"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>

                  {notes[currentEditNoteIndex]?.editable && (
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition cursor-pointer"
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
                onClick={(e) => e.stopPropagation()}
                className="modal-content modal-scroll"
                style={{
                  width: "600px",
                  maxHeight: "80vh",
                  backgroundColor: "#fff",
                  padding: 0,
                  borderRadius: "10px",
                  overflowY: "auto",
                  scrollbarGutter: "stable",
                }}
              >
                {/* Sticky Header */}
                <div
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#fff",
                    padding: "16px 20px",
                    borderBottom: "1px solid #ccc",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 1,
                  }}
                >
                  <h3 style={{ margin: 0 }}>{currentViewNote.title}</h3>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      lineHeight: 1,
                    }}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                </div>

                {/* Markdown Content */}
                <div style={{ padding: "20px" }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={renderers}
                  >
                    {currentViewNote.content
                      .replace(/\\n/g, "\n")
                      .replace(/^"(.*)"$/, "$1")
                      .replace(/^["']|["']$/g, "")}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
          <MindmapModal
            open={mindmapOpen}
            onClose={() => setMindmapOpen(false)}
            markdown={mindmapMarkdown}
          />
        </>
      )}
    </div>
  );
};
export default CardThree;
