import { useState, useEffect, useRef } from "react";
import "./CardThree.css";
import ReactMarkdown from "react-markdown";
import AudioOverview from "./AudioOverview";
import MindmapModal from "./MindmapModal";
import {
  ChevronRight,
  Edit,
  EllipsisVertical,
  FileText,
  GraduationCap,
  Headphones,
  Loader2,
  MessageSquareText,
  Network,
  Plus,
  Trash,
} from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea, ScrollBar } from "./ui/scrollarea";
import { PopoverClose } from "@radix-ui/react-popover";
import toast from "react-hot-toast";
import remarkGfm from "remark-gfm";

const CardThree = ({ notes, setNotes, selectedDocs, onCollapseChange }) => {
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);
  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditNoteIndex, setCurrentEditNoteIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loadingStates, setLoadingStates] = useState(new Set());
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentViewNote, setCurrentViewNote] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [mindmapOpen, setMindmapOpen] = useState(false);
  const [mindmapMarkdown, setMindmapMarkdown] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const audioRef = useRef(null);
  const abortControllers = useRef({});
  const endpoint = import.meta.env.VITE_API_URL;

  const addLoadingState = (type) => {
    setLoadingStates((prev) => new Set([...prev, type]));
  };

  const removeLoadingState = (type) => {
    setLoadingStates((prev) => {
      const newSet = new Set(prev);
      newSet.delete(type);
      return newSet;
    });
  };

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
    const course = localStorage.getItem("course");
    try {
      const res = await fetch(`${endpoint}/get-notes/${course}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setNotes(data?.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchMindmap = async () => {
    const loadingKey = `Mind Map-${Date.now()}`;
    addLoadingState(loadingKey);

    const payload = {
      selectedDocs: selectedDocs,
      course: localStorage.getItem("course"),
    };
    try {
      const res = await fetch(`${endpoint}/generate-mindmap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Mindmap API failed: ${res.status}`);

      const data = await res.json();
      const markdownContent = data.markdown || "No mindmap available.";

      const newMindmapNote = {
        Title: `Mind Map - ${new Date().toLocaleString()}`,
        Response: markdownContent,
        editable: false,
        type: "mindmap",
      };

      setTimeout(fetchNotes, 500);
    } catch (error) {
      console.error("Error generating mindmap:", error);
    } finally {
      removeLoadingState(loadingKey);
    }
  };

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

  const handleAddNote = () => {
    const newNote = {
      Title: `New Note - ${new Date().toLocaleString()}`,
      Response: "New note content...",
      editable: true,
    };
    setNotes([newNote, ...notes]);
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenIndex(null);
      }

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

  const handleNoteClick = (index) => {
    const note = notes[index];

    if (note.docType === "mindmap") {
      setMindmapMarkdown(note.Response);
      setMindmapOpen(true);
      return;
    }

    if (note.editable) {
      setCurrentEditNoteIndex(index);
      setEditTitle(note.Title);
      setEditContent(note.Response);
      setIsEditModalOpen(true);
    } else {
      setCurrentViewNote(note);
      setIsViewModalOpen(true);
    }
  };

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
        body: JSON.stringify({
          ...updatedNote,
          course: localStorage.getItem("course"),
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      const newNotes = [...notes];
      newNotes[currentEditNoteIndex] = {
        ...newNotes[currentEditNoteIndex],
        Title: editTitle,
        Response: editContent,
        editable: false,
      };
      setNotes(newNotes);

      await fetchNotes();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const handleFetchAndAddNote = async (type) => {
    let contentEndpoint = "";

    if (type === "Study Guide") contentEndpoint = `${endpoint}/study-guide`;
    else if (type === "Briefing Doc")
      contentEndpoint = `${endpoint}/briefing-doc`;
    else if (type === "FAQ") contentEndpoint = `${endpoint}/faq`;
    else return;

    const loadingKey = `${type}-${Date.now()}`;
    addLoadingState(loadingKey);

    try {
      const authToken = localStorage.getItem("token");
      const wrappedDocs = {
        selectedDocs: selectedDocs,
        course: localStorage.getItem("course"),
      };

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
        Title: `${type} - ${new Date().toLocaleString()}`,
        content: content || "No content available.",
        editable: false,
      };

      await fetchNotes();
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error);
    } finally {
      removeLoadingState(loadingKey);
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

  const handlePodcastLoadingChange = (isLoading) => {
    const loadingKey = `Podcast-${Date.now()}`;
    if (isLoading) {
      addLoadingState(loadingKey);
      window.currentPodcastLoadingKey = loadingKey;
    } else {
      if (window.currentPodcastLoadingKey) {
        removeLoadingState(window.currentPodcastLoadingKey);
        delete window.currentPodcastLoadingKey;
      }
    }
  };

  // fetch podcast audio
  const PodcastAudio = ({ docKey }) => {
    const [audioUrl, setAudioUrl] = useState(null);

    useEffect(() => {
      const fetchPodcast = async () => {
        try {
          const res = await fetch(`${endpoint}/fetch/podcast/${docKey}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `bearer ${localStorage.getItem("token")}`,
            },
          });
          if (!res.ok) throw new Error("Failed to fetch podcast");
          const blob = await res.blob();
          setAudioUrl(URL.createObjectURL(blob));
        } catch (err) {
          console.error("Error fetching podcast:", err);
        }
      };

      fetchPodcast();
    }, [docKey]);

    if (!audioUrl) {
      return (
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <Loader2 className="h-3 w-3 animate-spin" /> Loading podcast...
        </div>
      );
    }

    return <audio controls src={audioUrl} className="w-full mt-2" />;
  };

  return (
    <div
      className={`h-[84vh] md:border md:rounded-lg border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ml-auto text-black ${
        isCollapsed ? "w-15" : "w-full max-w-sm lg:max-w-md xl:max-w-lg"
      }`}
    >
      {isCollapsed ? (
        <div className="flex justify-center p-3 border-b border-gray-200">
          <button
            className="cursor-pointer p-2 rounded-lg hover:bg-gray-200 text-[#64748b]"
            onClick={toggleCollapse}
          >
            <ChevronRight />
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center font-semibold border-b border-gray-300 p-2 flex-shrink-0 bg-[#F8FAFC]">
            <span className="p-2 font-poppins">Library</span>
            <button
              className="cursor-pointer p-2 rounded-lg hover:bg-gray-200 text-[#64748b]"
              onClick={toggleCollapse}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-shrink-0 p-3 pb-0">
            <AudioOverview
              selectedDocs={selectedDocs}
              onLoadingChange={handlePodcastLoadingChange}
              onPodcastGenerated={(audioUrl) => {
                const newNote = {
                  Title: `Podcast - ${new Date().toLocaleString()}`,
                  Response: audioUrl,
                  editable: false,
                  type: "Podcast",
                };
                setNotes((prev) => [newNote, ...prev]);
              }}
            />

            <div className="border-t border-gray-200 pt-3 p">
              <Button
                className="library-button w-full mb-3"
                onClick={handleAddNote}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add note
              </Button>

              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                {noteTypes.map(({ label, icon: Icon }) => (
                  <Button
                    disabled={!selectedDocs.length}
                    key={label}
                    className="library-button w-[calc(50%-4px)] p-2"
                    onClick={() => {
                      if (label === "Mind Map") {
                        fetchMindmap();
                      } else {
                        handleFetchAndAddNote(label);
                      }
                    }}
                  >
                    <Icon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{label.split(" ")[0]}</span>
                  </Button>
                ))}
              </div>

              {loadingStates.size > 0 && (
                <div className="space-y-2 mt-3">
                  {Array.from(loadingStates).map((loadingKey) => {
                    const displayType = loadingKey.includes("-")
                      ? loadingKey.split("-")[0]
                      : loadingKey;
                    return (
                      <div
                        key={loadingKey}
                        className="border border-gray-200 rounded-lg p-4 flex items-center gap-2"
                      >
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        <span className="text-sm text-gray-700 animate-pulse">
                          Generating {displayType}...
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden pl-3 py-3">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-3">
                {notes && notes.length > 0 ? (
                  notes.map((note, index) => (
                    <div
                      key={note.docKey || index}
                      className="border border-gray-200 rounded-lg mb-3 p-1"
                      onClick={() => handleNoteClick(index)}
                    >
                      <div className="flex justify-between items-center font-semibold">
                        {/* Title */}
                        <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[210px] inline-block align-middle">
                          {note.Title}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {/* Play Audio (only if NOT podcast) */}
                          {note.docType !== "Podcast" && (
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
                          )}

                          {/* Popover Menu */}
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
                              className="bg-white w-36 p-1 rounded-lg border text-black border-gray-200"
                              align="end"
                              sideOffset={8}
                            >
                              <div className="grid gap-0.5">
                                <PopoverClose asChild>
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
                                </PopoverClose>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      {/* Note Content */}
                      <div className="text-[#555] text-xs sm:text-sm mt-2">
                        {note.docType === "Podcast" ? (
                          <PodcastAudio docKey={note.docKey} />
                        ) : note.editable ? (
                          <ReactMarkdown
                            components={{
                              p: ({ node, ...props }) => (
                                <p
                                  className="text-xs sm:text-sm leading-relaxed m-0 line-clamp-2"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {note.Response}
                          </ReactMarkdown>
                        ) : (
                          <div className="line-clamp-1 text-xs">
                            {note?.Response?.replace(/\\n/g, " ")
                              .replace(/^"(.*)"$/, "$1")
                              .replace(/^["']|["']$/g, "")
                              .replace(/^#+\s*/gm, "")
                              .slice(0, 100)}
                            {note?.Response?.length > 100 && "..."}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p>
                      No notes yet. Click &quot;Add note&quot; to create your
                      first note!
                    </p>
                  </div>
                )}
              </div>

              <ScrollBar orientation="vertical" />
            </ScrollArea>
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
        </div>
      )}
    </div>
  );
};

export default CardThree;
