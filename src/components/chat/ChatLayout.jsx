"use client";

import { ArrowLeft, MoreVertical, X } from "lucide-react";
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
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://10.10.7.19:8001";
const CHAT_STORAGE_KEY_PREFIX = "chat_messages_by_conversation_";
const CHAT_UNREAD_STORAGE_KEY_PREFIX = "chat_unread_by_conversation_";
const POLLING_INTERVAL_MS = 5000;

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
      id: payload.id || `${Date.now()}-${Math.random()}`,
      sender_id: payload.sender_id,
      receiver_id: payload.receiver_id,
      content: payload.content,
      created_at: payload.created_at || new Date().toISOString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }

  return null;
};

export default function ChatLayout({
  consultationId,
  loggedUserId,
  jwtToken,
  role,
}) {
  const [inputMessage, setInputMessage] = useState("");
  const [isThreadListVisible, setIsThreadListVisible] = useState(true);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [unreadByConversation, setUnreadByConversation] = useState({});
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);

  const socketsRef = useRef({});
  const hasHydratedStorageRef = useRef(false);
  const hasInitializedMessagePersistRef = useRef(false);
  const hasInitializedUnreadPersistRef = useRef(false);
  const hasInitialAutoSelectRef = useRef(false);
  const selectedConversationIdRef = useRef("");
  const conversationsRef = useRef([]);
  const unreadByConversationRef = useRef({});

  const isReady = Boolean(jwtToken && loggedUserId);
  const isAttorneyRole = `${role || ""}`.toLowerCase() === "attorney";

  const messageStorageKey = useMemo(
    () => `${CHAT_STORAGE_KEY_PREFIX}${loggedUserId}`,
    [loggedUserId],
  );

  const unreadStorageKey = useMemo(
    () => `${CHAT_UNREAD_STORAGE_KEY_PREFIX}${loggedUserId}`,
    [loggedUserId],
  );

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    unreadByConversationRef.current = unreadByConversation;
  }, [unreadByConversation]);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") return;

    hasInitializedMessagePersistRef.current = false;
    hasInitializedUnreadPersistRef.current = false;

    const storedMessages = window.localStorage.getItem(messageStorageKey);
    const storedUnread = window.localStorage.getItem(unreadStorageKey);

    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        if (parsedMessages && typeof parsedMessages === "object") {
          setMessagesByConversation(parsedMessages);
        }
      } catch {
        // keep existing in-memory message state if storage is malformed
      }
    }

    if (storedUnread) {
      try {
        const parsedUnread = JSON.parse(storedUnread);
        if (parsedUnread && typeof parsedUnread === "object") {
          setUnreadByConversation(parsedUnread);
        }
      } catch {
        // keep existing unread state if storage is malformed
      }
    }

    hasHydratedStorageRef.current = true;
  }, [isReady, messageStorageKey, unreadStorageKey]);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") return;
    if (!hasHydratedStorageRef.current) return;
    if (!hasInitializedMessagePersistRef.current) {
      hasInitializedMessagePersistRef.current = true;
      return;
    }

    try {
      window.localStorage.setItem(
        messageStorageKey,
        JSON.stringify(messagesByConversation),
      );
    } catch {
      // ignore storage write errors
    }
  }, [isReady, messageStorageKey, messagesByConversation]);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") return;
    if (!hasHydratedStorageRef.current) return;
    if (!hasInitializedUnreadPersistRef.current) {
      hasInitializedUnreadPersistRef.current = true;
      return;
    }

    try {
      window.localStorage.setItem(
        unreadStorageKey,
        JSON.stringify(unreadByConversation),
      );
    } catch {
      // ignore storage write errors
    }
  }, [isReady, unreadStorageKey, unreadByConversation]);

  useEffect(() => {
    setConversations((prev) =>
      prev.map((item) => ({
        ...item,
        unreadCount: unreadByConversation[item.id] ?? item.unreadCount ?? 0,
      })),
    );
  }, [unreadByConversation]);

  const selectedConversation = useMemo(
    () =>
      conversations.find((item) => item.id === selectedConversationId) || null,
    [conversations, selectedConversationId],
  );

  const currentMessages = useMemo(
    () => messagesByConversation[selectedConversationId] || [],
    [messagesByConversation, selectedConversationId],
  );

  const currentConsultationId = selectedConversation?.consultationId || "";
  const isAccepted = selectedConversation?.status === "accepted";

  const thread = useMemo(
    () => ({
      id: selectedConversation?.id || "",
      name: selectedConversation?.name || "Select Conversation",
      image: selectedConversation?.image || "/images/user.jpg",
      lastMessage:
        selectedConversation?.lastMessage ||
        currentMessages[currentMessages.length - 1]?.content ||
        "No messages yet",
      time:
        selectedConversation?.time ||
        currentMessages[currentMessages.length - 1]?.time ||
        "",
    }),
    [selectedConversation, currentMessages],
  );

  const appendMessageForConversation = (
    conversationKey,
    message,
    { increaseUnreadWhenInactive = true } = {},
  ) => {
    if (!conversationKey || !message) return;

    const isOpenedConversation =
      conversationKey === selectedConversationIdRef.current;

    setMessagesByConversation((prev) => ({
      ...prev,
      [conversationKey]: [...(prev[conversationKey] || []), message],
    }));

    setUnreadByConversation((prev) => ({
      ...prev,
      [conversationKey]: isOpenedConversation
        ? 0
        : increaseUnreadWhenInactive
          ? (prev[conversationKey] || 0) + 1
          : prev[conversationKey] || 0,
    }));

    setConversations((prev) => {
      const updated = prev.map((item) =>
        item.id === conversationKey
          ? {
              ...item,
              lastMessage: message.content || item.lastMessage,
              time: message.time || item.time,
              createdAt: message.created_at || item.createdAt,
              unreadCount: isOpenedConversation
                ? 0
                : increaseUnreadWhenInactive
                  ? (item.unreadCount || 0) + 1
                  : item.unreadCount || 0,
            }
          : item,
      );

      return updated.sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
    });
  };

  const handleSocketMessage = (conversationRecord, payload) => {
    if (payload?.error) {
      toast.error(payload.error);
      return;
    }

    if (payload?.ack) {
      return;
    }

    const normalizedMessage = normalizeIncoming(payload);
    if (!normalizedMessage) return;

    const me = Number(loggedUserId);
    const senderId = Number(normalizedMessage.sender_id);
    const receiverId = Number(normalizedMessage.receiver_id);
    const otherUserId = senderId === me ? receiverId : senderId;

    let conversationKey = conversationRecord?.id || "";

    if (!conversationKey && Number.isFinite(otherUserId)) {
      const mappedConversation = conversationsRef.current.find(
        (item) => Number(item.id) === Number(otherUserId),
      );
      conversationKey = mappedConversation?.id || `${otherUserId}`;
    }

    appendMessageForConversation(conversationKey, normalizedMessage, {
      increaseUnreadWhenInactive: true,
    });
  };

  useEffect(() => {
    if (!isReady) return;

    let intervalId;

    const fetchAcceptedConversations = async () => {
      setLoadingConversations(true);

      let rows = [];
      const endpoint = isAttorneyRole
        ? "/api/attorney/consultations/me/"
        : "/api/attorney/consultations/reply-messages/";

      try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
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
        setLoadingConversations(false);
        return;
      }

      const filteredAccepted = rows.filter((item) => {
        if (`${item?.status || ""}`.toLowerCase() !== "accepted") return false;

        if (isAttorneyRole) return true;

        const senderId = Number(item?.sender?.id || item?.sender_id);
        const receiverId = Number(item?.receiver?.id || item?.receiver_id);
        const me = Number(loggedUserId);
        return senderId === me || receiverId === me;
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
          consultationId:
            item?.consultation || item?.consultation_id || item?.id,
          senderId: Number(item?.sender?.id || item?.sender_id) || null,
          receiverId: Number(item?.receiver?.id || item?.receiver_id) || null,
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

      const normalizedMetadata = Array.from(groupedByOtherUser.values()).sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );

      setConversations((prev) => {
        const previousById = prev.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});

        return normalizedMetadata.map((item) => ({
          ...previousById[item.id],
          ...item,
          unreadCount:
            unreadByConversationRef.current[item.id] ??
            previousById[item.id]?.unreadCount ??
            0,
        }));
      });

      if (normalizedMetadata.length) {
        if (!hasInitialAutoSelectRef.current) {
          const fromQuery = consultationId
            ? normalizedMetadata.find(
                (item) =>
                  Number(item.consultationId) === Number(consultationId),
              )
            : null;

          const initialConversationId =
            fromQuery?.id || normalizedMetadata[0].id;
          setSelectedConversationId(initialConversationId);
          setUnreadByConversation((prev) => ({
            ...prev,
            [initialConversationId]: 0,
          }));
          hasInitialAutoSelectRef.current = true;
        }
      } else {
        setConversations([]);
        if (!selectedConversationIdRef.current) {
          setSelectedConversationId("");
        }
      }

      setLoadingConversations(false);
    };

    fetchAcceptedConversations();

    intervalId = window.setInterval(() => {
      fetchAcceptedConversations();
    }, POLLING_INTERVAL_MS);

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [consultationId, isReady, isAttorneyRole, jwtToken, loggedUserId]);

  useEffect(() => {
    if (!isReady) return;

    const activeSockets = socketsRef.current;
    const expectedConsultationIds = new Set();

    conversations.forEach((conversation) => {
      const consultationKey = `${conversation.consultationId || ""}`;
      if (!consultationKey || conversation.status !== "accepted") return;

      expectedConsultationIds.add(consultationKey);

      if (activeSockets[consultationKey]) return;

      const chatSocket = new ChatSocket({
        consultationId: conversation.consultationId,
        jwtToken,
        onMessage: (payload) => handleSocketMessage(conversation, payload),
        onError: ({ code, message }) => {
          if (code === 4001 || code === 4002) {
            toast.error(
              message || "Authentication failed. Please login again.",
            );
          }
        },
      });

      activeSockets[consultationKey] = chatSocket;
      chatSocket.connect();
    });

    Object.keys(activeSockets).forEach((consultationKey) => {
      if (expectedConsultationIds.has(consultationKey)) return;
      activeSockets[consultationKey].close();
      delete activeSockets[consultationKey];
    });
  }, [conversations, isReady, jwtToken]);

  useEffect(() => {
    return () => {
      Object.values(socketsRef.current).forEach((socket) => socket.close());
      socketsRef.current = {};
    };
  }, []);

  useEffect(() => {
    if (!selectedConversationId) return;

    setUnreadByConversation((prev) => ({
      ...prev,
      [selectedConversationId]: 0,
    }));

    setConversations((prev) =>
      prev.map((item) =>
        item.id === selectedConversationId ? { ...item, unreadCount: 0 } : item,
      ),
    );
  }, [selectedConversationId]);

  const handleSendMessage = () => {
    const text = inputMessage.trim();
    if (!text) return;

    if (!currentConsultationId) {
      toast.error("Please select an active conversation.");
      return;
    }

    const consultationKey = `${currentConsultationId}`;
    const activeSocket = socketsRef.current[consultationKey];
    const sent = activeSocket?.sendMessage(text);

    if (sent) {
      setInputMessage("");
    } else {
      toast.error("Message could not be sent. Please try again.");
    }
  };

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    setIsThreadListVisible(false);
    setShowOptionsMenu(false);
  };

  const handleClearCurrentConversation = () => {
    if (!selectedConversationId) return;

    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedConversationId]: [],
    }));

    setShowOptionsMenu(false);
    toast.success("Chat messages cleared for this conversation.");
  };

  return (
    <>
      <Toaster position="top-right" />
      <section className="max-w-[1440px] mx-auto w-full md:w-11/12 overflow-hidden pt-28">
        <div
          className={`flex h-[calc(100vh-64px)] md:h-[80vh] w-full text-white border border-gray-700 rounded-xl shadow-2xl relative`}
        >
          <div
            className={`absolute inset-0 md:relative md:w-1/4 md:min-w-[300px] border-r border-gray-700/50 flex flex-col z-10 
                   
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
            </div>

            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelect={handleSelectConversation}
            />
          </div>

          <div
            className={`
            flex-1 flex flex-col overflow-hidden 
            md:relative 
            ${isThreadListVisible ? "hidden md:flex" : "fixed inset-0 z-50 flex "}
        
          `}
          >
            <div
              className={`flex items-center justify-between p-3.5 border-b border-gray-700/50 `}
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
                  onClick={() => setShowOptionsMenu((prev) => !prev)}
                  className={`p-2 rounded-full text-gray-400 hover:text-white transition hover:bg-element`}
                  aria-label="Options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {showOptionsMenu && (
                  <div className="absolute top-10 right-4 rounded-xl bg-secondary p-4 max-w-xs z-20">
                    <button
                      onClick={() => setShowRatingModal(true)}
                      className="flex flex-row items-center truncate gap-2 py-2 px-6 bg-gray/10 w-full text-white text-sm"
                    >
                      <RiStarLine className="text-2xl text-primary" /> Rate the
                      Attorney
                    </button>
                    <button
                      onClick={handleClearCurrentConversation}
                      className="flex flex-row items-center truncate gap-2 py-2 px-6 bg-gray/10 w-full text-white text-sm mt-2"
                    >
                      <X className="w-4 h-4" /> Clear Chat
                    </button>
                  </div>
                )}
              </div>
            </div>

            {selectedConversation ? (
              <>
                <MessageList
                  messages={currentMessages}
                  loggedUserId={loggedUserId}
                />

                {isAccepted ? (
                  <MessageInput
                    value={inputMessage}
                    onChange={setInputMessage}
                    onSend={handleSendMessage}
                  />
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
                  <h1 className="text-2xl md:text-3xl text-text_color">
                    How many stars would you give to him?
                  </h1>
                  <p className="text-text_color">
                    After your consultation, please take a moment to rate your
                    experience to help us maintain the highest standards of
                    service.
                  </p>
                  <Rating
                    className="space-x-3"
                    emptySymbol={
                      <RiStarLine className="text-4xl text-primary" />
                    }
                    fullSymbol={
                      <RiStarFill className="text-4xl text-primary" />
                    }
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
