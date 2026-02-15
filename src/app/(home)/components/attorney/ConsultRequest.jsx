"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { BiMessageAltDetail, BiLoaderAlt } from "react-icons/bi";
import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import { useRouter } from "next/navigation";
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
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
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const conversationSignatureRef = useRef({});
  const selectedConversationIdRef = useRef("");

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  // --- TanStack Query for Fetching Data ---
  const { data: rawData, isLoading } = useQuery({
    queryKey: ["consultations"],
    queryFn: async () => {
      const tokenData = localStorage.getItem("token");
      const tokens = JSON.parse(tokenData);

      if (!tokens?.accessToken) throw new Error("No Access Token");

      const res = await axios.get(
        "http://10.10.7.19:8002/api/attorney/consultations/me/",
        {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        },
      );
      return res.data;
    },
    refetchInterval: POLLING_INTERVAL_MS,
    onError: () => toast.error("Failed to sync data"),
  });

  // --- Local User Identity ---
  const loggedUserId = useMemo(() => {
    if (typeof window === "undefined") return 0;
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    return Number(userData?.id || userData?.user_id || 0);
  }, []);

  // --- Processing Conversations (Memoized) ---
  const { requests, conversations } = useMemo(() => {
    if (!rawData) return { requests: [], conversations: [] };

    const received = rawData.received || [];
    const sent = rawData.sent || [];
    const allRows = [...received, ...sent];
    const acceptedRows = allRows.filter(
      (item) => `${item?.status || ""}`.toLowerCase() === "accepted",
    );

    const unreadStorageKey = `${CHAT_UNREAD_STORAGE_KEY_PREFIX}${loggedUserId}`;
    const messageStorageKey = `${CHAT_STORAGE_KEY_PREFIX}${loggedUserId}`;

    let unreadMap = {};
    let messageMap = {};
    try {
      unreadMap =
        JSON.parse(localStorage.getItem(unreadStorageKey) || "{}") || {};
      messageMap =
        JSON.parse(localStorage.getItem(messageStorageKey) || "{}") || {};
    } catch (e) {
      unreadMap = {};
      messageMap = {};
    }

    const nextSignatures = {};
    const previousSignatures = conversationSignatureRef.current;

    const grouped = acceptedRows.reduce((acc, item) => {
      const senderId = Number(item?.sender?.id || item?.sender_id);
      const receiverId = Number(item?.receiver?.id || item?.receiver_id);
      const otherUser =
        senderId === loggedUserId ? item?.receiver : item?.sender;
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
        unreadCount: unreadMap[key] ?? (item?.is_read ? 0 : 1),
        createdAt: item?.created_at || "",
        senderId,
        receiverId,
      };

      if (
        !existing ||
        new Date(record.createdAt) > new Date(existing.createdAt)
      ) {
        acc.set(key, record);
      }
      return acc;
    }, new Map());

    const normalized = Array.from(grouped.values()).map((conversation) => {
      const signature = `${conversation.createdAt || ""}|${conversation.lastMessage || ""}`;
      nextSignatures[conversation.id] = signature;

      const previousSignature = previousSignatures[conversation.id];
      const hasChanged = Boolean(
        previousSignature && previousSignature !== signature,
      );

      // Only compute, do not mutate refs or localStorage here
      return {
        ...conversation,
        _signature: signature,
        _hasChanged: hasChanged,
      };
    });

    return {
      requests: received,
      conversations: normalized.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    };
  }, [rawData, loggedUserId]);

  // --- Side effect: update refs and localStorage after render ---
  useEffect(() => {
    if (!conversations) return;
    const nextSignatures = {};
    const unreadMap = {};
    const messageMap = {};
    conversations.forEach((conversation) => {
      const { id, createdAt, lastMessage, senderId, receiverId, time, _signature, _hasChanged } = conversation;
      nextSignatures[id] = _signature;
      // Only update messageMap and unreadMap if lastMessage is valid
      if (lastMessage && lastMessage !== "No messages yet") {
        const existingMessages = messageMap[id] || [];
        const lastExisting = existingMessages[existingMessages.length - 1];
        const lastExistingSignature = lastExisting
          ? `${lastExisting.created_at || ""}|${lastExisting.content || ""}`
          : "";
        if (
          existingMessages.length === 0 ||
          (_hasChanged && lastExistingSignature !== _signature)
        ) {
          const snapshot = {
            id: `${id}-${createdAt || "snapshot"}`,
            sender_id: senderId,
            receiver_id: receiverId,
            content: lastMessage,
            created_at: createdAt || new Date().toISOString(),
            time,
          };
          messageMap[id] = [...existingMessages, snapshot];
          // Increment unread if background
          if (
            _hasChanged &&
            id !== selectedConversationIdRef.current
          ) {
            unreadMap[id] = (unreadMap[id] || 0) + 1;
          }
        }
      }
    });
    conversationSignatureRef.current = nextSignatures;
    if (typeof window !== "undefined") {
      const unreadStorageKey = `${CHAT_UNREAD_STORAGE_KEY_PREFIX}${loggedUserId}`;
      const messageStorageKey = `${CHAT_STORAGE_KEY_PREFIX}${loggedUserId}`;
      localStorage.setItem(unreadStorageKey, JSON.stringify(unreadMap));
      localStorage.setItem(messageStorageKey, JSON.stringify(messageMap));
    }
  }, [conversations, loggedUserId]);

  const handleOpenOfferModal = (item) => {
    setSelectedRequest(item);
    setShowModal(true);
  };

  const handleOpenConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    const selected = conversations.find((item) => item.id === conversationId);
    if (!selected) return;

    // Reset Unread in LocalStorage
    const unreadStorageKey = `${CHAT_UNREAD_STORAGE_KEY_PREFIX}${loggedUserId}`;
    try {
      const current = JSON.parse(
        localStorage.getItem(unreadStorageKey) || "{}",
      );
      localStorage.setItem(
        unreadStorageKey,
        JSON.stringify({ ...current, [conversationId]: 0 }),
      );
    } catch (e) {}

    router.push(`/message?consultationId=${selected.consultationId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-secondary rounded-xl">
        <BiLoaderAlt className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

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
                      &ldquo;{item.message}&rdquo;
                    </p>
                  </div>
                  {item.status === "pending" && (
                    <div className="grid grid-cols-2 items-center gap-4">
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
