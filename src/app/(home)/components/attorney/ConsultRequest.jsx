"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { BiMessageAltDetail, BiLoaderAlt } from "react-icons/bi";
import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { toast } from "react-toastify";
import ConversationList from "@/components/chat/ConversationList";

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

export default function ConsultRequest() {
  const router = useRouter();
  const { setShowModal, setSelectedRequest } = useAuth();
  const [requests, setRequests] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggedUserId, setLoggedUserId] = useState(0);
  const conversationSignatureRef = React.useRef({});
  const selectedConversationIdRef = React.useRef("");

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  // 1. Fetch Dynamic Data from API
  useEffect(() => {
    let intervalId;

    const fetchConsultations = async (isInitial = false) => {
      const tokenData = localStorage.getItem("token");
      const tokens = JSON.parse(tokenData);

      if (!tokens?.accessToken) {
        toast.error("Session expired. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://10.10.7.19:8001/api/attorney/consultations/me/",
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          },
        );
        // Ensure we are setting the real data from the 'received' array
        setRequests(res.data.received || []);

        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const currentLoggedUserId = Number(
          userData?.id || userData?.user_id || 0,
        );
        setLoggedUserId(currentLoggedUserId);
        const unreadStorageKey = `${CHAT_UNREAD_STORAGE_KEY_PREFIX}${currentLoggedUserId}`;
        const messageStorageKey = `${CHAT_STORAGE_KEY_PREFIX}${currentLoggedUserId}`;

        let unreadMap = {};
        let messageMap = {};
        try {
          unreadMap =
            JSON.parse(localStorage.getItem(unreadStorageKey) || "{}") || {};
        } catch {
          unreadMap = {};
        }

        try {
          messageMap =
            JSON.parse(localStorage.getItem(messageStorageKey) || "{}") || {};
        } catch {
          messageMap = {};
        }

        const allRows = [
          ...(res.data.received || []),
          ...(res.data.sent || []),
        ];
        const acceptedRows = allRows.filter(
          (item) => `${item?.status || ""}`.toLowerCase() === "accepted",
        );

        const nextSignatures = {};
        const previousSignatures = conversationSignatureRef.current;

        const grouped = acceptedRows.reduce((acc, item) => {
          const senderId = Number(item?.sender?.id || item?.sender_id);
          const receiverId = Number(item?.receiver?.id || item?.receiver_id);
          const otherUser =
            senderId === currentLoggedUserId ? item?.receiver : item?.sender;
          if (!otherUser?.id) return acc;

          const key = `${otherUser.id}`;
          const existing = acc.get(key);

          const record = {
            id: key,
            consultationId:
              item?.consultation || item?.consultation_id || item?.id,
            name: otherUser.full_name || otherUser.email || "Unknown",
            email: otherUser.email || "",
            image: otherUser.profile_image || "/images/user.jpg",
            lastMessage:
              item?.message || item?.description || "No messages yet",
            time: formatTime(item?.created_at),
            unreadCount: unreadMap[key] ?? (item?.is_read ? 0 : 1),
            createdAt: item?.created_at || "",
            senderId,
            receiverId,
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
              unreadCount: unreadMap[key] ?? existing.unreadCount,
            });
          }

          return acc;
        }, new Map());

        const normalized = Array.from(grouped.values())
          .map((conversation) => {
            const signature = `${conversation.createdAt || ""}|${conversation.lastMessage || ""}`;
            nextSignatures[conversation.id] = signature;

            const previousSignature = previousSignatures[conversation.id];
            const hasChanged = Boolean(
              previousSignature && previousSignature !== signature,
            );

            if (
              conversation.lastMessage &&
              conversation.lastMessage !== "No messages yet"
            ) {
              const existingMessages = messageMap[conversation.id] || [];
              const lastExisting =
                existingMessages[existingMessages.length - 1];
              const lastExistingSignature = lastExisting
                ? `${lastExisting.created_at || ""}|${lastExisting.content || ""}`
                : "";

              if (
                existingMessages.length === 0 ||
                (hasChanged && lastExistingSignature !== signature)
              ) {
                const snapshot = {
                  id: `${conversation.id}-${conversation.createdAt || Date.now()}`,
                  sender_id: conversation.senderId,
                  receiver_id: conversation.receiverId,
                  content: conversation.lastMessage,
                  created_at:
                    conversation.createdAt || new Date().toISOString(),
                  time: conversation.time,
                };
                messageMap = {
                  ...messageMap,
                  [conversation.id]: [...existingMessages, snapshot],
                };
              }

              if (
                hasChanged &&
                conversation.id !== selectedConversationIdRef.current
              ) {
                unreadMap = {
                  ...unreadMap,
                  [conversation.id]: (unreadMap[conversation.id] || 0) + 1,
                };
              }
            }

            return {
              ...conversation,
              unreadCount:
                unreadMap[conversation.id] ?? conversation.unreadCount ?? 0,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime(),
          );

        conversationSignatureRef.current = nextSignatures;
        localStorage.setItem(unreadStorageKey, JSON.stringify(unreadMap));
        localStorage.setItem(messageStorageKey, JSON.stringify(messageMap));

        setConversations(normalized);
      } catch (error) {
        console.error("Fetch Error:", error);
        if (isInitial) {
          toast.error("Failed to load real-time requests");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations(true);
    intervalId = window.setInterval(
      () => fetchConsultations(false),
      POLLING_INTERVAL_MS,
    );

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  // 2. This function links the list to the Modal
  const handleOpenOfferModal = (item) => {
    // CRITICAL: We pass the REAL object to the global context
    setSelectedRequest(item);
    // Now the Modal has data and will render
    setShowModal(true);
  };

  const handleOpenConversation = (conversationId) => {
    setSelectedConversationId(conversationId);

    const selected = conversations.find((item) => item.id === conversationId);
    if (!selected) return;

    const unreadStorageKey = `${CHAT_UNREAD_STORAGE_KEY_PREFIX}${loggedUserId}`;
    const messageStorageKey = `${CHAT_STORAGE_KEY_PREFIX}${loggedUserId}`;

    try {
      const current =
        JSON.parse(localStorage.getItem(unreadStorageKey) || "{}") || {};
      localStorage.setItem(
        unreadStorageKey,
        JSON.stringify({
          ...current,
          [conversationId]: 0,
        }),
      );
    } catch {
      // ignore localStorage errors
    }

    try {
      const currentMessages =
        JSON.parse(localStorage.getItem(messageStorageKey) || "{}") || {};
      const existing = currentMessages[conversationId] || [];

      if (
        existing.length === 0 &&
        selected.lastMessage &&
        selected.lastMessage !== "No messages yet"
      ) {
        const snapshot = {
          id: `${conversationId}-${selected.createdAt || Date.now()}`,
          sender_id: selected.senderId,
          receiver_id: selected.receiverId,
          content: selected.lastMessage,
          created_at: selected.createdAt || new Date().toISOString(),
          time: selected.time || formatTime(selected.createdAt),
        };

        localStorage.setItem(
          messageStorageKey,
          JSON.stringify({
            ...currentMessages,
            [conversationId]: [snapshot],
          }),
        );
      }
    } catch {
      // ignore localStorage errors
    }

    setConversations((prev) =>
      prev.map((item) =>
        item.id === conversationId ? { ...item, unreadCount: 0 } : item,
      ),
    );

    router.push(`/message?consultationId=${selected.consultationId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-secondary rounded-xl">
        <BiLoaderAlt className="animate-spin text-primary text-4xl" />
      </div>
    );
  }
  console.log(requests, "consultRequest");
  return (
    <div className="w-full text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-secondary p-4 rounded-xl border border-gray-700/30 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            Clients Requests
            <span className="bg-primary text-[10px] px-2 py-0.5 rounded-full">
              {requests.length}
            </span>
          </h2>

          <div className="flex flex-col gap-4">
            {requests.length > 0 ? (
              requests.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#212121] border border-gray/20 hover:border-primary/40 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 w-full">
                      <div className="relative shrink-0">
                        <Image
                          src={item.sender.profile_image}
                          height={50}
                          width={50}
                          alt="Sender"
                          className="w-12 h-12 rounded-full object-cover border border-gray-700 group-hover:border-primary/50 transition"
                        />
                        {item.status === "pending" && (
                          <span className="absolute top-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-[#212121]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-base truncate">
                          {item.sender.full_name || "Guest User"}
                        </p>
                        <p className="text-xs text-gray-400 truncate font-semibold uppercase tracking-tighter">
                          {item.subject}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 p-3 rounded-lg mb-4 border border-white/5">
                    <p className="text-sm text-gray-300 line-clamp-2 italic">
                      "{item.message}"
                    </p>
                  </div>
                  {item.status === "pending" && (
                    <div className="grid grid-cols-2 items-center gap-4">
                      {/* Both buttons now trigger the Modal with the dynamic 'item' */}
                      <button
                        onClick={() => handleOpenOfferModal(item)}
                        className="w-full py-2 rounded-lg text-white text-xs font-medium border border-gray-600 hover:bg-white/5 transition"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleOpenOfferModal(item)}
                        className="w-full py-2 rounded-lg text-white text-xs font-semibold bg-primary hover:bg-opacity-90 transition shadow-lg shadow-primary/10"
                      >
                        Send Offer
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 border border-dashed border-gray-700 rounded-xl">
                <p className="text-gray-500 italic">No incoming requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Score Section */}
        <div className="p-6 bg-secondary rounded-2xl flex flex-col gap-2 shadow-lg border border-gray-700/30">
          <h1 className="text-gray-400 text-sm font-medium uppercase tracking-widest">
            Attorney Score
          </h1>
          <div className="flex flex-row gap-4 items-center">
            <div className="flex text-primary">
              <RiStarFill className="text-2xl" />
              <RiStarFill className="text-2xl" />
              <RiStarFill className="text-2xl" />
              <RiStarFill className="text-2xl" />
              <RiStarLine className="text-2xl" />
            </div>
            <p className="text-3xl font-bold font-lora">4.0</p>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden bg-secondary p-4 shadow-lg border border-gray-700/30">
          <div className="flex items-center py-2 border-b border-gray-700/50 mb-4">
            <BiMessageAltDetail className="w-5 h-5 mr-3 text-primary" />
            <h2 className="text-lg font-semibold">Recent Conversations</h2>
          </div>

          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelect={handleOpenConversation}
          />
        </div>
      </div>
    </div>
  );
}
