"use client";

import { useState, useEffect } from "react";
import {
  GraduationCap,
  Home,
  Loader2,
  LogOut,
  Menu,
  PenSquare,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [previousFeedbacks, setPreviousFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // const endpoint = process.env.NEXT_PUBLIC_API_URL;
  const endpoint = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setShowMenu(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        if (!endpoint) {
          console.warn("API endpoint not configured");
          return;
        }

        const res = await fetch(`${endpoint}/feedback`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setPreviousFeedbacks(data?.data || []);
        console.log("Fetched previous feedbacks: ", data);
      } catch (error) {
        console.error("Error fetching feedbacks = ", error);
      }
    };

    if (openDialog) {
      fetchFeedback();
    }
  }, [openDialog, endpoint]);

  const handleSendFeedback = async () => {
    try {
      setFeedbackLoading(true);
      const res = await fetch(`${endpoint}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: titleInput.trim(),
          message: feedbackInput.trim(),
        }),
      });

      const data = await res.json();
      console.log("theasdad", data);
    } catch (error) {
      console.error("error fetching data", error);
    } finally {
      setFeedbackLoading(false);
    }

    if (feedbackInput.trim() && titleInput.trim()) {
      const newFeedback = {
        Title: titleInput.trim(),
      };
      setPreviousFeedbacks([newFeedback, ...previousFeedbacks]);
      setTitleInput("");
      setFeedbackInput("");
      setSelectedFeedback(null);
      toast.success("Feedback submitted successfully!");
    } else {
      toast.error("Please fill in both title and feedback");
    }
  };

  const handleFeedbackClick = (feedback) => {
    setSelectedFeedback(feedback);
  };

  const handleNewFeedback = () => {
    setSelectedFeedback(null);
    setTitleInput("");
    setFeedbackInput("");
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${endpoint}/fetch/podcast/119ae2b4-9be3-4711-bfd5-eb84ced0f1b4_QKv`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      console.log("the data===>", data);
    };
    fetchData();
  }, []);

  return (
    <nav className="bg-white text-black shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <span className="text-2xl font-bold tracking-wide">myUstad.ai</span>
        </div>

        {!isMobile && (
          <div className="flex space-x-6 text-sm font-medium text-gray-500">
            <a
              href="/courses"
              className="hover:text-gray-800 transition-colors"
            >
              Home
            </a>
            <a
              href="/courses"
              className="hover:text-gray-800 transition-colors"
            >
              Courses
            </a>
            <a
              href="mailto:info@aisystems.com"
              className="hover:text-gray-800 transition-colors"
            >
              Contact
            </a>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {!isMobile && (
            <>
              <button
                onClick={() => setOpenDialog(true)}
                className="cursor-pointer bg-[#f5f5f5] hover:bg-[#e5e5e5] text-gray-800 p-2 rounded-full border border-gray-300 shadow-sm transition duration-200"
              >
                <PenSquare className="w-4 h-4" />
              </button>

              <div className="relative inline-block text-left z-50">
                <button
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className="cursor-pointer bg-[#f5f5f5] hover:bg-[#e5e5e5] text-gray-800 p-2 rounded-full border border-gray-300 shadow-sm transition duration-200"
                >
                  <User className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 min-w-[180px] max-w-[220px] bg-white text-black rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                    style={{ overflowWrap: "break-word" }}
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-x-2 px-4 py-3 hover:bg-red-100 transition text-sm text-red-500 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-mono">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {isMobile && (
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 ml-2"
            >
              {showMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="w-[95vw] lg:w-[80vw] xl:w-[100vw] mx-auto bg-white border-0 shadow-2xl p-0 flex flex-col max-h-[92vh]">
          {/* Header */}
          <DialogHeader className="p-5 bg-gradient-to-br from-slate-50 via-gray-50 to-white border-b border-gray-200">
            <DialogTitle className="text-3xl font-semibold text-gray-900 tracking-tight">
              {selectedFeedback ? "View Feedback" : "Share Your Feedback"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-sm leading-relaxed max-w-2xl">
              {selectedFeedback
                ? "Review your previous feedback below."
                : "Help us improve myUstad.ai by sharing your thoughts, suggestions, or reporting any issues you've encountered."}
            </DialogDescription>
          </DialogHeader>

          {/* Body (split 50/50) */}
          <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto">
            {/* Left side - Previous Feedbacks */}
            {previousFeedbacks.length > 0 && (
              <div className="basis-1/2 shrink-0 overflow-y-auto border-r border-gray-100 bg-gradient-to-b from-white to-slate-50/50 p-4 pt-0">
                <div className="flex items-center gap-3 mb-5">
                  <h4 className="text-m font-semibold text-gray-800">
                    Previous Feedback
                  </h4>
                  <div className="h-px bg-gradient-to-r from-gray-200 to-transparent flex-1"></div>
                </div>
                <div className="space-y-4">
                  {previousFeedbacks.map((feedback) => (
                    <div
                      key={feedback.keyy || feedback.id}
                      onClick={() => handleFeedbackClick(feedback)}
                      className={`group cursor-pointer rounded-xl p-2 border border-gray-300`}
                    >
                      <h5 className="font-semibold text-sm text-gray-700 mb-2">
                        {feedback.Title}
                      </h5>
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {feedback.message}
                      </p>
                      {feedback.timestamp && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          {feedback.timestamp}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Right side - Feedback Form / View */}
            <div className="basis-1/2 shrink-0 p-4 pt-0 overflow-y-auto">
              <div className="space-y-6">
                {selectedFeedback && (
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      onClick={handleNewFeedback}
                      className="text-sm rounded-lg bg-slate-50 hover:bg-slate-100"
                    >
                      + New Feedback
                    </Button>
                  </div>
                )}

                {selectedFeedback ? (
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-2">
                        Title
                      </label>
                      <div className="w-full px-5 py-4 border border-gray-200 rounded-xl bg-slate-50 text-gray-900 text-base">
                        {selectedFeedback.Title}
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <label className="block text-lg font-semibold text-gray-800 mb-2">
                        Feedback
                      </label>
                      <div className="w-full px-5 py-4 border border-gray-200 rounded-xl bg-slate-50 text-gray-900 text-base leading-relaxed min-h-[140px]">
                        {selectedFeedback.Message}
                      </div>
                    </div>

                    {selectedFeedback.timestamp && (
                      <p className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        Submitted {selectedFeedback.timestamp}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Title Input */}
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-m font-semibold text-gray-800 mb-2"
                      >
                        Title
                      </label>
                      <input
                        id="title"
                        type="text"
                        placeholder="Enter a title for your feedback..."
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition text-gray-900 placeholder-gray-400 bg-white text-base"
                      />
                    </div>

                    {/* Feedback Input */}
                    <div>
                      <label
                        htmlFor="feedback"
                        className="block text-m font-semibold text-gray-800 mb-2"
                      >
                        Your feedback
                      </label>
                      <div className="relative">
                        <textarea
                          id="feedback"
                          rows={5}
                          placeholder="Tell us what's on your mind..."
                          value={feedbackInput}
                          onChange={(e) => setFeedbackInput(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition resize-none text-gray-900 placeholder-gray-400 bg-white text-base leading-relaxed"
                        />
                        <span className="absolute bottom-3 right-4 text-xs text-gray-400">
                          {feedbackInput.length}/500
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer - pinned at bottom */}
          <DialogFooter className="p-4 bg-gradient-to-r from-slate-50 via-gray-50 to-white border-t border-gray-200 flex gap-4 justify-end shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                setOpenDialog(false);
                handleNewFeedback();
              }}
              disabled={feedbackLoading}
            >
              Cancel
            </Button>

            {!selectedFeedback && (
              <Button
                className="bg-black text-white flex items-center gap-2"
                onClick={handleSendFeedback}
                disabled={
                  feedbackLoading || !titleInput.trim() || !feedbackInput.trim()
                }
              >
                {feedbackLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Sending...
                  </>
                ) : (
                  "Send Feedback"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isMobile && (
        <>
          <div
            onClick={() => setShowMenu(false)}
            className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 ${
              showMenu
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          />
          <div
            className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transition-all duration-500 ease-in-out ${
              showMenu
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div className="px-6 py-4 flex justify-between items-center border-b">
              <span className="text-xl font-bold">Menu</span>
              <button
                onClick={() => setShowMenu(false)}
                className="text-gray-600 hover:text-blue-600"
              >
                <X />
              </button>
            </div>

            <div className="px-6 mt-6 space-y-4 text-sm">
              <button
                className="flex items-center"
                onClick={() => navigate("/courses")}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
              <button
                className="flex items-center"
                onClick={() => navigate("/courses")}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Courses
              </button>
              <button
                className="flex items-center"
                onClick={() => {
                  setShowMenu(false);
                  setOpenDialog(true);
                }}
              >
                <PenSquare className="w-4 h-4 mr-2" />
                Feedback
              </button>
              <button
                className="flex items-center text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
