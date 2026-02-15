"use client";

import { ArrowLeft, MessageSquare, MoreVertical, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import Rating from "react-rating";
import toast, { Toaster } from "react-hot-toast";
import { ChatSocket } from "@/lib/chatSocket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ConversationList from "./ConversationList";

const PRIMARY_COLOR_CLASSES = "bg-blue-500 hover:bg-blue-600";
const SECONDARY_BG_COLOR = "bg-[#1D1F23]";
const APP_BG = "bg-[#12151B]";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.10.7.19:8001";

const formatTime = (isoTime) => {
  if (!isoTime) return "";
  try {
    return new Date(isoTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const normalizeConversationRows = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;

  const collected = [];
  if (Array.isArray(data?.received)) collected.push(...data.received);
  if (Array.isArray(data?.sent)) collected.push(...data.sent);
  return collected;
};

const normalizeIncoming = (payload) => {
  if (!payload || typeof payload !== "object") return null;

  if (payload.type === "message") {
    return {
      id: Date.now() + Math.random(),
      sender_id: payload.sender_id,
      receiver_id: payload.receiver_id,
      content: payload.content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }

  return null;
};

export default function ChatLayout({ consultationId, loggedUserId, jwtToken, role }) {
  const [inputMessage, setInputMessage] = useState("");
  const [isThreadListVisible, setIsThreadListVisible] = useState(true);
  const [showRate, setShowRate] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);

  const socketRef = useRef(null);

  const isReady = Boolean(jwtToken && loggedUserId);

  const selectedConversation = useMemo(
    () => conversations.find((item) => item.id === selectedConversationId) || null,
    [conversations, selectedConversationId],
  );

  const currentConsultationId = selectedConversation?.consultationId || "";
  const isAccepted = selectedConversation?.status === "accepted";

  const thread = useMemo(
    () => ({
      id: selectedConversation?.id || "",
      name: selectedConversation?.name || "Select Conversation",
      image: selectedConversation?.image || "/images/user.jpg",
      lastMessage: selectedConversation?.lastMessage || messages[messages.length - 1]?.content || "No messages yet",
      time: selectedConversation?.time || messages[messages.length - 1]?.time || "",
    }),
    [selectedConversation, messages],
  );

  useEffect(() => {
    if (!isReady) return;

    const fetchAcceptedConversations = async () => {
      setLoadingConversations(true);

      let rows = [];
      try {
        const res = await fetch(`${API_BASE_URL}/api/attorney/consultations/reply-messages/`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed ${res.status}`);
        }

        const data = await res.json();
        rows = normalizeConversationRows(data);
      } catch {
        toast.error("Could not load accepted conversations.");
      }

      const filteredAccepted = rows.filter((item) => {
        if (`${item?.status || ""}`.toLowerCase() !== "accepted") return false;

        const senderId = Number(item?.sender?.id || item?.sender_id);
        const receiverId = Number(item?.receiver?.id || item?.receiver_id);
        const me = Number(loggedUserId);

        if (role === "attorney") {
          return senderId === me;
        }

        return receiverId === me;
      });

      const groupedByOtherUser = filteredAccepted.reduce((acc, item) => {
        const senderId = Number(item?.sender?.id || item?.sender_id);
        const receiverId = Number(item?.receiver?.id || item?.receiver_id);
        const me = Number(loggedUserId);

        const otherUser = senderId === me ? item?.receiver : item?.sender;
        if (!otherUser?.id) return acc;

        const key = `${otherUser.id}`;
        const existing = acc.get(key);

        const record = {
          id: key,
          consultationId: item?.consultation || item?.consultation_id || item?.id,
          name: otherUser.full_name || otherUser.email || "Unknown",
          email: otherUser.email || "",
          image: otherUser.profile_image || "/images/user.jpg",
          lastMessage: item?.message || item?.description || "No messages yet",
          time: formatTime(item?.created_at),
          unreadCount: item?.is_read ? 0 : 1,
          status: item?.status,
          createdAt: item?.created_at || "",
        };

        if (!existing) {
          acc.set(key, record);
          return acc;
        }

        const existingDate = new Date(existing.createdAt || 0).getTime();
        const currentDate = new Date(record.createdAt || 0).getTime();
        if (currentDate > existingDate) {
          acc.set(key, {
            ...record,
            unreadCount: existing.unreadCount + record.unreadCount,
          });
        } else {
          acc.set(key, {
            ...existing,
            unreadCount: existing.unreadCount + record.unreadCount,
          });
        }

        return acc;
      }, new Map());

      const normalized = Array.from(groupedByOtherUser.values()).sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
      );

      setConversations(normalized);

      if (normalized.length) {
        const fromQuery = consultationId
          ? normalized.find((item) => Number(item.consultationId) === Number(consultationId))
          : null;
        setMessages([]);
        setSelectedConversationId(fromQuery?.id || normalized[0].id);
      } else {
        setMessages([]);
        setSelectedConversationId("");
      }

      setLoadingConversations(false);
    };

    fetchAcceptedConversations();
  }, [consultationId, isReady, jwtToken, loggedUserId]);

  useEffect(() => {
    if (!isReady || !currentConsultationId || !isAccepted) return;

    const chatSocket = new ChatSocket({
      consultationId: currentConsultationId,
      jwtToken,
      onMessage: (payload) => {
        if (payload?.error) {
          toast.error(payload.error);
          return;
        }

        if (payload?.ack) {
          return;
        }

        const message = normalizeIncoming(payload);
        if (message) {
          setMessages((prev) => [...prev, message]);
        }
      },
      onError: ({ code, message }) => {
        if (code === 4001 || code === 4002) {
          toast.error(message || "Authentication failed. Please login again.");
          return;
        }

        if (message) {
          toast.error(message);
        }
      },
    });

    socketRef.current = chatSocket;
    chatSocket.connect();

    return () => {
      chatSocket.close();
      socketRef.current = null;
    };
  }, [currentConsultationId, jwtToken, isReady, isAccepted]);

  const handleSendMessage = () => {
    const text = inputMessage.trim();
    if (!text) return;

    const sent = socketRef.current?.sendMessage(text);
    if (sent) {
      setInputMessage("");
    }
  };

  if (!loadingConversations && !conversations.length) {
    return (
      <section className="max-w-[1440px] mx-auto w-full md:w-11/12 overflow-hidden pt-28">
        <div className="flex h-[calc(100vh-64px)] md:h-[80vh] w-full text-white bg-[#1D1F23] rounded-xl shadow-2xl items-center justify-center">
          <p className="text-gray-300">No accepted conversations found.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <section className="max-w-[1440px] mx-auto w-full md:w-11/12 overflow-hidden pt-28">
        <div
          className={`flex h-[calc(100vh-64px)] md:h-[80vh] w-full text-white ${SECONDARY_BG_COLOR} rounded-xl shadow-2xl relative`}
        >
          <div
            className={`absolute inset-0 md:relative md:w-1/4 md:min-w-[300px] border-r border-gray-700/50 flex flex-col z-10 
                   bg-secondary
                      ${isThreadListVisible ? "block" : "hidden md:block"}`}
          >
            <div className="flex items-center justify-start p-4 border-b border-gray-700/50">
              <Link
                href="/"
                className={`p-2 rounded-full text-gray-400 hover:text-white transition hidden md:block`}
                aria-label="Go back to dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <button
                className={`flex items-center ml-0 md:ml-4 px-4 py-2 rounded-lg text-white font-semibold ${PRIMARY_COLOR_CLASSES}`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </button>
            </div>

            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelect={(conversationId) => {
                setMessages([]);
                setSelectedConversationId(conversationId);
                setIsThreadListVisible(false);
              }}
            />
          </div>

          <div
            className={`
            flex-1 flex flex-col overflow-hidden 
            md:relative 
            ${isThreadListVisible ? "hidden md:flex" : "fixed inset-0 z-50 flex bg-black"}
            ${APP_BG}
          `}
          >
            <div
              className={`flex items-center justify-between p-4 border-b border-gray-700/50 ${SECONDARY_BG_COLOR}`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsThreadListVisible(true)}
                  className={`p-2 rounded-full text-gray-400 hover:text-white transition md:hidden`}
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>

                <Image
                  src={thread.image}
                  height={40}
                  width={40}
                  alt={thread.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <h2 className="text-lg font-bold">{thread.name}</h2>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowRate(!showRate)}
                  className={`p-2 rounded-full text-gray-400 hover:text-white transition hover:bg-element`}
                  aria-label="Options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {showRate && (
                  <div className="absolute top-10 right-4 rounded-xl bg-secondary p-4 max-w-xs z-20">
                    <button
                      onClick={() => setShowRatingModal(true)}
                      className="flex flex-row items-center truncate gap-2 py-2 px-6 bg-gray/10 w-full text-white text-sm"
                    >
                      <RiStarLine className="text-2xl text-primary" /> Rate the Attorney
                    </button>
                  </div>
                )}
              </div>
            </div>

            {selectedConversation ? (
              <>
                <MessageList messages={messages} loggedUserId={loggedUserId} />

                {isAccepted ? (
                  <MessageInput value={inputMessage} onChange={setInputMessage} onSend={handleSendMessage} />
                ) : (
                  <div className="p-3 md:p-4 border-t border-gray-700/50 bg-secondary text-center text-sm text-yellow-400">
                    Chat will be available after this consultation is accepted.
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 w-full flex items-center justify-center text-sm text-gray-400">
                Select a conversation to start chatting.
              </div>
            )}
          </div>

          {showRatingModal && (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <div className="max-w-md mx-auto min-h-[300px] rounded-2xl bg-secondary border border-gray p-6 md:p-8 text-center">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowRatingModal(false)}
                    className="p-2 rounded-full bg-element hover:bg-secondary flex items-center justify-center"
                  >
                    <X />
                  </button>
                </div>
                <div className=" space-y-6">
                  <h1 className="text-2xl md:text-3xl text-text_color">How many stars would you give to him?</h1>
                  <p className="text-text_color">
                    After your consultation, please take a moment to rate your experience to help us maintain the highest standards of service.
                  </p>
                  <Rating
                    className="space-x-3"
                    emptySymbol={<RiStarLine className="text-4xl text-primary" />}
                    fullSymbol={<RiStarFill className="text-4xl text-primary" />}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
