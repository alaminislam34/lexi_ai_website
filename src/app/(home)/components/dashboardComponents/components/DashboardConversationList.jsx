"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.10.7.19:8002";
const CHAT_STORAGE_KEY_PREFIX = "chat_messages_by_conversation_";
const CHAT_UNREAD_STORAGE_KEY_PREFIX = "chat_unread_by_conversation_";

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

const normalizeRows = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;

  const collected = [];
  if (Array.isArray(data?.received)) collected.push(...data.received);
  if (Array.isArray(data?.sent)) collected.push(...data.sent);
  return collected;
};

const getAuthSnapshot = () => {
  if (typeof window === "undefined") {
    return { token: "", userId: "", role: "user" };
  }

  try {
    const tokenData = JSON.parse(localStorage.getItem("token") || "{}");
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      token: tokenData?.accessToken || "",
      userId: userData?.id || userData?.user_id || "",
      role: userData?.role === "attorney" ? "attorney" : "user",
    };
  } catch {
    return { token: "", userId: "", role: "user" };
  }
};

export default function DashboardConversationList({
  title = "Recent Conversations",
  limit = 4,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState({ token: "", userId: "", role: "user" });
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const signaturesRef = useRef({});

  const unreadStorageKey = useMemo(
    () => `${CHAT_UNREAD_STORAGE_KEY_PREFIX}${auth.userId || ""}`,
    [auth.userId],
  );

  const messageStorageKey = useMemo(
    () => `${CHAT_STORAGE_KEY_PREFIX}${auth.userId || ""}`,
    [auth.userId],
  );

  useEffect(() => {
    setAuth(getAuthSnapshot());
  }, []);

  useEffect(() => {
    if (!auth.token || !auth.userId) {
      setLoading(false);
      return;
    }

    let intervalId;

    const fetchConversations = async () => {
      try {
        const endpoint =
          auth.role === "attorney"
            ? "/api/attorney/consultations/me/"
            : "/api/attorney/consultations/reply-messages/";

        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed ${res.status}`);
        }

        const data = await res.json();
        const rows = normalizeRows(data);

        const accepted = rows.filter(
          (row) => `${row?.status || ""}`.toLowerCase() === "accepted",
        );

        const grouped = accepted.reduce((acc, row) => {
          const me = Number(auth.userId);
          const senderId = Number(row?.sender?.id || row?.sender_id);
          const receiverId = Number(row?.receiver?.id || row?.receiver_id);
          const otherUser = senderId === me ? row?.receiver : row?.sender;

          if (!otherUser?.id) return acc;

          const key = `${otherUser.id}`;
          const existing = acc.get(key);
          const record = {
            id: key,
            consultationId: row?.consultation || row?.consultation_id || row?.id,
            name: otherUser.full_name || otherUser.email || "Unknown",
            image: otherUser.profile_image || "/images/user.jpg",
            lastMessage: row?.message || row?.description || "No messages yet",
            createdAt: row?.created_at || "",
            time: formatTime(row?.created_at),
            unreadCount: row?.is_read ? 0 : 1,
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

        let unreadFromStorage = {};
        let messageMap = {};
        try {
          unreadFromStorage = JSON.parse(localStorage.getItem(unreadStorageKey) || "{}") || {};
        } catch {
          unreadFromStorage = {};
        }

        try {
          messageMap = JSON.parse(localStorage.getItem(messageStorageKey) || "{}") || {};
        } catch {
          messageMap = {};
        }

        const nextSignatures = {};

        const enriched = Array.from(grouped.values()).map((item) => {
          const signature = `${item.createdAt || ""}|${item.lastMessage || ""}`;
          nextSignatures[item.id] = signature;

          const previousSignature = signaturesRef.current[item.id];
          const hasChanged = Boolean(previousSignature && previousSignature !== signature);

          const hasRealMessage = item.lastMessage && item.lastMessage !== "No messages yet";
          if (hasRealMessage) {
            const existingMessages = messageMap[item.id] || [];
            const lastExisting = existingMessages[existingMessages.length - 1];
            const lastExistingSignature = lastExisting
              ? `${lastExisting.created_at || ""}|${lastExisting.content || ""}`
              : "";

            if (existingMessages.length === 0 || (hasChanged && lastExistingSignature !== signature)) {
              const snapshot = {
                id: `${item.id}-${item.createdAt || Date.now()}`,
                sender_id: null,
                receiver_id: null,
                content: item.lastMessage,
                created_at: item.createdAt || new Date().toISOString(),
                time: item.time,
              };

              messageMap = {
                ...messageMap,
                [item.id]: [...existingMessages, snapshot],
              };
            }

            if (hasChanged && item.id !== selectedConversationId) {
              unreadFromStorage = {
                ...unreadFromStorage,
                [item.id]: (unreadFromStorage[item.id] || 0) + 1,
              };
            }
          }

          return {
            ...item,
            unreadCount: unreadFromStorage[item.id] ?? item.unreadCount ?? 0,
          };
        });

        localStorage.setItem(unreadStorageKey, JSON.stringify(unreadFromStorage));
        localStorage.setItem(messageStorageKey, JSON.stringify(messageMap));
        signaturesRef.current = nextSignatures;

        const normalized = enriched
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime(),
          )
          .slice(0, limit);

        setItems(normalized);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    intervalId = window.setInterval(fetchConversations, 8000);

    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [auth, unreadStorageKey, messageStorageKey, limit, selectedConversationId]);

  const clearUnreadFor = (conversationId) => {
    if (!auth.userId || typeof window === "undefined") return;
    try {
      const current = JSON.parse(localStorage.getItem(unreadStorageKey) || "{}") || {};
      const next = { ...current, [conversationId]: 0 };
      localStorage.setItem(unreadStorageKey, JSON.stringify(next));
      setSelectedConversationId(conversationId);
      setItems((prev) =>
        prev.map((item) =>
          item.id === conversationId ? { ...item, unreadCount: 0 } : item,
        ),
      );
    } catch {
      // ignore storage errors
    }
  };

  return (
    <div className="rounded-xl overflow-hidden bg-secondary p-4 shadow-lg border border-gray-700/30">
      <div className="flex items-center py-2 border-b border-gray-700/50 mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-6 text-center">Loading conversations...</p>
      ) : !items.length ? (
        <p className="text-sm text-gray-400 py-6 text-center">No accepted conversations yet.</p>
      ) : (
        <div className="divide-y divide-gray-700/40">
          {items.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/message?consultationId=${conversation.consultationId}`}
              onClick={() => clearUnreadFor(conversation.id)}
              className="flex items-center gap-3 py-3 hover:bg-white/5 rounded-lg px-2 transition"
            >
              <Image
                src={conversation.image}
                alt={conversation.name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm text-white font-medium truncate">{conversation.name}</p>
                <p className="text-xs text-gray-400 truncate">{conversation.lastMessage}</p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-gray-500">{conversation.time}</span>
                {conversation.unreadCount > 0 && (
                  <span className="text-[10px] bg-blue-500 text-white rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-gray-700/50 pt-3">
        <Link
          href="/message"
          className="w-full py-2 inline-block text-center rounded-lg text-white text-sm transition duration-300 bg-primary hover:bg-dark-primary"
        >
          Open Messages
        </Link>
      </div>
    </div>
  );
}
