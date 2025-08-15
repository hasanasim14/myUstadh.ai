import React, { useState, useEffect, useRef } from "react";
import "./CardThree.css";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import AudioOverview from "./AudioOverview";
import MindmapModal from "./MindmapModal";
import {
  Edit,
  EllipsisVertical,
  FileText,
  GraduationCap,
  Headphones,
  MessageSquareText,
  Network,
  Plus,
  Trash,
} from "lucide-react";
import remarkGfm from "remark-gfm";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import toast from "react-hot-toast";

const CardThree = ({ notes, setNotes, selectedDocs, onCollapseChange }) => {
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
  const abortControllers = useRef({});
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

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const authToken = localStorage.getItem("token");
    try {
      const res = await fetch(`${endpoint}/get-notes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${authToken}`,
        },
      });

      const data = await res.json();
      setNotes(data?.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // function added to fetch the mindmap from the backend when the user clicks on the Mind Map button
  const fetchMindmap = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${endpoint}/generate-mindmap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ selectedDocs }),
      });

      if (!res.ok) throw new Error(`Mindmap API failed: ${res.status}`);

      const data = await res.json();
      const markdownContent = data.markdown || "No mindmap available.";

      const newMindmapNote = {
        Title: "Mind Map",
        Response: markdownContent,
        editable: false,
        type: "mindmap",
      };

      // Refresh from backend after short delay to ensure it's saved
      setTimeout(fetchNotes, 500);
    } catch (error) {
      console.error("Error generating mindmap:", error);
    } finally {
      setLoading(false);
    }
  };

  // function added to play the audio of the note content when the user clicks on the headphone icon
  const playNoteAudioFromAPI = async (text, index) => {
    if (clickedIndex === index && !playingIndex) {
      const controller = abortControllers.current[index];
      if (controller) {
        controller.abort();
        delete abortControllers.current[index];
      }
      setClickedIndex(null);
      return;
    }

    if (playingIndex === index) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingIndex(null);
      setClickedIndex(null);
      return;
    }

    const controller = new AbortController();
    abortControllers.current[index] = controller;
    setClickedIndex(index);

    try {
      const response = await fetch(`${endpoint}/generate-audio/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setPlayingIndex(index);
        setClickedIndex(null);
      };

      audio.onended = () => {
        setPlayingIndex(null);
        setClickedIndex(null);
      };

      await audio.play();
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Audio playback failed:", error);
      }
      setPlayingIndex(null);
      setClickedIndex(null);
    } finally {
      delete abortControllers.current[index];
    }
  };

  // function added to handle the addition of a manual note when the user clicks on Add a Note button
  const handleAddNote = () => {
    const newNote = {
      Title: `New Note`,
      Response: "New note content...",
      editable: true,
    };
    setNotes([newNote, ...notes]);
  };

  // function added to perform the functionality of deleting a manually added note
  const handleDeleteNote = async (docKey, indexToDelete) => {
    const updatedNotes = notes.filter((_, i) => i !== indexToDelete);
    try {
      const response = await fetch(`${endpoint}/remove-note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ docKey: docKey }),
      });
      if (response.ok) {
        setNotes(updatedNotes);
        toast.success("Note Deleted!");
      }
    } catch (error) {
      console.error("error deleting the note", error);
      toast.error("Error deleting the note. Please try again later");
    }
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

    if (note.docType === "mindmap") {
      setMindmapMarkdown(note.Response);
      setMindmapOpen(true);
      return;
    }

    if (note.editable) {
      // open edit modal
      setCurrentEditNoteIndex(index);
      setEditTitle(note.Title);
      setEditContent(note.Response);
      setIsEditModalOpen(true);
    } else {
      // open view-only modal
      setCurrentViewNote(note);
      setIsViewModalOpen(true);
    }
  };

  // function added that handles the edit made to a manually added note in the modal
  const handleSaveEdit = async () => {
    const updatedNote = {
      title: editTitle,
      note: editContent,
    };

    try {
      const authToken = localStorage.getItem("token");
      const res = await fetch(`${endpoint}/save-note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${authToken}`,
        },
        body: JSON.stringify(updatedNote),
      });

      if (!res.ok) throw new Error("Save failed");

      // Set editable to false after successful save
      const newNotes = [...notes];
      newNotes[currentEditNoteIndex] = {
        ...newNotes[currentEditNoteIndex],
        Title: editTitle,
        Response: editContent,
        editable: false,
      };
      setNotes(newNotes);

      await fetchNotes(); // Refresh with server copy
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  // removed the get-note-title api
  const handleFetchAndAddNote = async (type) => {
    let contentEndpoint = "";

    if (type === "Study Guide") contentEndpoint = `${endpoint}/study-guide`;
    else if (type === "Briefing Doc")
      contentEndpoint = `${endpoint}/briefing-doc`;
    else if (type === "FAQ") contentEndpoint = `${endpoint}/faq`;
    else return;

    setLoading(true);

    try {
      const authToken = localStorage.getItem("token");
      const wrappedDocs = { selectedDocs };

      // Fetch content
      const contentResponse = await fetch(contentEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${authToken}`,
        },
        body: JSON.stringify(wrappedDocs),
      });

      if (!contentResponse.ok)
        throw new Error(`Content API error: ${contentResponse.status}`);

      const content = await contentResponse.text();

      const newNote = {
        Title: type, // Fallback to using the type as title
        content: content || "No content available.",
        editable: false,
      };

      await fetchNotes();
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error);
    } finally {
      setLoading(false);
    }
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
    <div
      className={`h-[84vh] md:border md:rounded-lg border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ml-auto ${
        isCollapsed ? "w-15" : "w-full"
      }`}
    >
      {isCollapsed ? (
        <div className="flex justify-center p-3 border-b border-gray-200">
          <button
            className="cursor-pointer p-2 rounded-lg hover:bg-gray-200 text-[#64748b]"
            onClick={toggleCollapse}
          >
            <FiChevronLeft />
          </button>
        </div>
      ) : (
        <>
          <div className="card-header">
            <span className="title">Library</span>
            <button
              className="cursor-pointer p-2 m-2 rounded-lg hover:bg-gray-200 text-[#64748b]"
              onClick={toggleCollapse}
            >
              <FiChevronRight />
            </button>
            {/* </span> */}
          </div>

          <div className="card-container">
            <AudioOverview selectedDocs={selectedDocs} />

            <div className="notes-section">
              {/* <span className="section-title" style={{ fontSize: "13px" }}>
                Notes
              </span> */}
              <button
                className="library-button w-full mb-2"
                onClick={handleAddNote}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add note
              </button>

              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                {noteTypes.map(({ label, icon: Icon }) => (
                  <Button
                    disabled={!selectedDocs.length}
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
                  </Button>
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
              <div className="notes-scroll-container border-t border-gray-200 px-1 py-4 overflow-y-auto lg:h-[150px]">
                {notes?.map((note, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg mb-3"
                    onClick={() => handleNoteClick(index)}
                    style={{
                      position: "relative",
                      cursor: "pointer",
                      minHeight: "20px",
                      maxHeight: "55px",
                      overflow: "hidden",
                      paddingBottom: "10px",
                      paddingRight: "10px",
                      paddingLeft: "10px",
                    }}
                  >
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[210px] inline-block align-middle">
                        {note.Title}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playNoteAudioFromAPI(note.Response, index);
                          }}
                          className={`bg-transparent cursor-pointer outline-none ${
                            clickedIndex === index
                              ? "text-red-500"
                              : playingIndex === index
                              ? "text-green-500"
                              : "text-black"
                          }`}
                        >
                          <Headphones className="w-4 h-4" />
                        </button>

                        {/* Delete button popover */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              className="p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <EllipsisVertical className="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="bg-white w-35 p-1 rounded-lg border text-white border-gray-200"
                            align="end"
                            sideOffset={8}
                          >
                            <div className="grid gap-0.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start gap-2 px-3 py-2 h-8 text-sm text-red-500 hover:bg-red-200 hover:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNote(note.docKey, index);
                                }}
                              >
                                <Trash className="h-3.5 w-3.5 text-red-500" />
                                <span>Delete</span>
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="mt-0 text-[#555] text-xs">
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
                          {note.Response}
                        </ReactMarkdown>
                      ) : (
                        <div>
                          {" "}
                          {(note.Response || "")
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
                  <h3 style={{ margin: 0 }}>{currentViewNote.Title}</h3>
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
                    {(currentViewNote.Response || "")
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
