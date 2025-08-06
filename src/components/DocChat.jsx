import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaRobot } from "react-icons/fa";
import { Pin, Headphones, Mic, SendHorizonal, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import "./DocChat.css";
import remarkGfm from "remark-gfm";

const DocChat = ({ selectedDocs, refreshTrigger, onPinNote, setIsLoading }) => {
  const initialBotMessage = {
    from: "bot",
    text: "Hi there! I'm StudyBot, your AI study assistant. How can I help you today?",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const [messages, setMessages] = useState([initialBotMessage]);
  const [input, setInput] = useState("");
  const [clickedIndex, setClickedIndex] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const abortControllers = useRef({});

  const endpoint = import.meta.env.VITE_API_URL;

  // check for session id for get chat api
  useEffect(() => {
    const sessionId = localStorage.getItem("session_id");

    if (!sessionId) {
      setMessages([initialBotMessage]);
      return;
    }

    const fetchChats = async () => {
      try {
        const response = await fetch(`${endpoint}/get-chats/${sessionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch chat history");

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          const formattedMessages = data.data.map((item) => ({
            from: item.type.toLowerCase() === "user" ? "user" : "bot",
            text: item.content,
            time: new Date(item.ts).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

          setMessages((prev) => [initialBotMessage, ...formattedMessages]);
        } else {
          setMessages([initialBotMessage]);
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
        setMessages([initialBotMessage]);
      }
    };

    fetchChats();
  }, [refreshTrigger]);

  // api to generate audio
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

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          try {
            const response = await fetch(`${endpoint}/transcribe`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${localStorage.getItem("token")}`,
              },
              body: formData,
            });

            const data = await response.json();
            setInput(data.transcription);
          } catch (error) {
            console.error("Transcription failed:", error);
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access denied or not available", err);
      }
    }
  };

  const sendMessage = async (customInput) => {
    const userInput = customInput || input;
    if (!userInput.trim()) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMessage = { from: "user", text: userInput, time };
    const loadingMessage = {
      from: "bot",
      text: (
        <div className="typing-dots">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      ),
      time: "",
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = [];
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        if (msg.from === "user" && messages[i + 1]?.from === "bot") {
          conversationHistory.push({
            question: msg.text,
            answer: messages[i + 1].text,
          });
          i++;
        }
      }

      conversationHistory.push({
        question: userInput,
        answer: null,
      });

      const sessionId = localStorage.getItem("session_id") || "";

      const payload = {
        question: userInput,
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        conversation: conversationHistory,
      };
      const filterpayload = {
        question: payload.question,
        timestamp: payload.timestamp,
        conversation: payload.conversation,
        session_id: sessionId,
        selectedDocs: selectedDocs,
      };

      let response;
      if (!selectedDocs || selectedDocs.length === 0) {
        response = await fetch(`${endpoint}/ask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${endpoint}/query_with_filter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(filterpayload),
        });
      }

      const data = await response.json();

      if (data.session_id) {
        localStorage.setItem("session_id", data.session_id);
      }

      const botReply =
        data?.reply || "Thanks for your message! I am working on it.";
      const botTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [...updated, { from: "bot", text: botReply, time: botTime }];
      });
    } catch (error) {
      console.error("API error:", error);
      const botTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [
          ...updated,
          {
            from: "bot",
            text: "Sorry, something went wrong while processing your question.",
            time: botTime,
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 mb-2 ${
              msg.from === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {msg.from === "user" ? (
                <FaUser
                  size={25}
                  className="text-white bg-[#bbdefb] rounded-full p-1"
                />
              ) : (
                <FaRobot
                  size={25}
                  className="text-white bg-[#c8e6c9] rounded-full p-1"
                />
              )}
            </div>

            {/* Message + timestamp */}
            <div className="flex flex-col items-start max-w-[75%] sm:max-w-[80%]">
              <div
                className={`px-3 py-2 rounded-xl whitespace-pre-wrap break-words text-sm ${
                  msg.from === "user"
                    ? "bg-blue-100 text-black self-end"
                    : "bg-green-100 text-black self-start"
                }`}
                style={{ minWidth: "50px" }}
              >
                {typeof msg.text === "string" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        />
                      ),
                      table: ({ node, ...props }) => (
                        <table className="table-auto border border-collapse border-gray-300 my-4">
                          {props.children}
                        </table>
                      ),
                      th: ({ node, ...props }) => (
                        <th className="border px-4 py-2 bg-gray-100 text-left">
                          {props.children}
                        </th>
                      ),
                      td: ({ node, ...props }) => (
                        <td className="border px-4 py-2">{props.children}</td>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>

              {/* Timestamp + Actions */}
              <div
                className={`mt-1 text-xs text-gray-500 flex items-center ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                } w-full`}
              >
                {msg.time}

                {msg.from === "bot" && msg.text !== initialBotMessage.text && (
                  <>
                    <Pin
                      size={12}
                      className="ml-4 cursor-pointer"
                      title="Pin this response"
                      onClick={() => {
                        const userQuestion =
                          messages[index - 1]?.from === "user"
                            ? messages[index - 1].text
                            : "Unknown Question";
                        const botAnswer =
                          typeof msg.text === "string" ? msg.text : "";
                        onPinNote(userQuestion, botAnswer);
                      }}
                    />
                    <Headphones
                      size={12}
                      className="ml-3 cursor-pointer"
                      title="Listen to this response"
                      onClick={() => playNoteAudioFromAPI(msg.text, index)}
                      style={{
                        color:
                          clickedIndex === index
                            ? "red"
                            : playingIndex === index
                            ? "green"
                            : "black",
                      }}
                    />
                    <Copy size={12} className="ml-3 cursor-pointer" />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex pr-4">
        <input
          className="chat-message-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Start Typing..."
        />
        <div
          className="p-2 hover:bg-gray-100 rounded-full"
          // className="mic-icon"
          onClick={toggleRecording}
          style={{ color: isRecording ? "green" : "black", cursor: "pointer" }}
          title={isRecording ? "Stop Recording" : "Start Recording"}
        >
          {/* <FaMicrophone size={18} /> */}
          <Mic className="w-6 h-6" />
        </div>
        <button
          className="p-2 bg-[#3b4dd1] text-white rounded-full cursor-pointer"
          onClick={() => sendMessage()}
          disabled={!input.trim()}
        >
          <SendHorizonal className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default DocChat;
