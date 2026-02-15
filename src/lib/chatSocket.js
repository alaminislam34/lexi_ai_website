const CLOSE_CODE_MESSAGES = {
  4001: "Authorization token missing. Please login again.",
  4002: "Invalid or expired token. Please login again.",
};

const normalizeWsBaseUrl = () => {
  let base = process.env.NEXT_PUBLIC_WS_BASE_URL?.replace(/\/+$/, "");

  if (!base && typeof window !== "undefined") {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    base = `${protocol}://${window.location.hostname}:8000`;
  }

  if (!base) {
    base = "ws://localhost:8000";
  }

  // Ensure it starts with ws:// or wss://
  if (!base.startsWith("ws://") && !base.startsWith("wss://")) {
    base = `ws://${base}`;
  }

  return base;
};

const getWsBaseCandidates = (base) => {
  const candidates = [base];

  const match8001 = base.match(/^(wss?:\/\/[^/:]+):8001$/i);
  if (match8001) {
    candidates.push(`${match8001[1]}:8000`);
  }

  return [...new Set(candidates)];
};

export class ChatSocket {
  constructor({
    consultationId,
    jwtToken,
    onOpen,
    onMessage,
    onError,
    onClose,
  }) {
    this.consultationId = consultationId;
    this.jwtToken = jwtToken;
    this.onOpen = onOpen;
    this.onMessage = onMessage;
    this.onError = onError;
    this.onClose = onClose;

    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 6;
    this.reconnectTimer = null;
    this.manuallyClosed = false;
    this.baseCandidates = [];
    this.currentBaseIndex = 0;
    this.connectionOpened = false;
  }

  connect() {
    if (!this.consultationId || !this.jwtToken) {
      console.error("[ChatSocket] Missing consultationId or JWT token");
      this.onError?.({
        code: "CONFIG_ERROR",
        message: "Missing consultation or token.",
      });
      return;
    }

    this.manuallyClosed = false;

    if (!this.baseCandidates.length) {
      this.baseCandidates = getWsBaseCandidates(normalizeWsBaseUrl());
      this.currentBaseIndex = 0;
    }

    const base = this.baseCandidates[this.currentBaseIndex] || this.baseCandidates[0];
    const url = `${base}/ws/consultations/${this.consultationId}/?token=${encodeURIComponent(this.jwtToken)}`;
    console.log("[ChatSocket] Connecting to URL:", url);

    try {
      this.socket = new WebSocket(url);
    } catch (error) {
      console.error("[ChatSocket] Failed to initialize WebSocket:", error);
      this.onError?.({
        code: "SOCKET_INIT_FAILED",
        message: error?.message || "WebSocket init failed",
      });
      return;
    }

    this.socket.onopen = () => {
      console.log("[ChatSocket] WebSocket connected ✅");
      this.connectionOpened = true;
      this.reconnectAttempts = 0;
      this.onOpen?.();
    };

    this.socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.log("[ChatSocket] Received message:", payload);
        this.onMessage?.(payload);
      } catch (err) {
        console.error("[ChatSocket] Invalid JSON received:", event.data);
        this.onError?.({
          code: "INVALID_JSON",
          message: "Invalid message format from server.",
        });
      }
    };

    this.socket.onerror = () => {
      const socketInfo = {
        url: this.socket?.url,
        readyState: this.socket?.readyState,
      };
      console.warn("[ChatSocket] Socket transport warning:", socketInfo);
      this.onError?.({
        code: "SOCKET_ERROR",
        message: "Connection issue detected. Reconnecting...",
      });
    };

    this.socket.onclose = (event) => {
      console.warn("[ChatSocket] Socket closed, code:", event.code);

      const closeMessage = CLOSE_CODE_MESSAGES[event.code];
      if (closeMessage) {
        console.error("[ChatSocket] Close code message:", closeMessage);
        this.onError?.({ code: event.code, message: closeMessage });
      }

      this.onClose?.(event);

      if (
        !this.manuallyClosed &&
        !this.connectionOpened &&
        this.currentBaseIndex < this.baseCandidates.length - 1
      ) {
        this.currentBaseIndex += 1;
        console.log("[ChatSocket] Trying fallback WS base:", this.baseCandidates[this.currentBaseIndex]);
        this.reconnectTimer = setTimeout(() => this.connect(), 250);
        return;
      }

      this.currentBaseIndex = 0;
      this.connectionOpened = false;

      // Auto-reconnect if not manually closed
      if (
        !this.manuallyClosed &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        const backoffMs = Math.min(2000 * 2 ** this.reconnectAttempts, 10000);
        console.log(`[ChatSocket] Reconnecting in ${backoffMs}ms...`);
        this.reconnectAttempts += 1;
        this.reconnectTimer = setTimeout(() => this.connect(), backoffMs);
      }
    };
  }

  sendMessage(content) {
    if (!this.socket) {
      console.error("[ChatSocket] Socket not initialized");
      this.onError?.({
        code: "SOCKET_NOT_OPEN",
        message: "Socket is not connected.",
      });
      return false;
    }

    if (this.socket.readyState !== WebSocket.OPEN) {
      console.error(
        "[ChatSocket] Socket is not open yet, readyState:",
        this.socket.readyState,
      );
      this.onError?.({
        code: "SOCKET_NOT_OPEN",
        message: "Socket is not connected.",
      });
      return false;
    }

    const text = `${content || ""}`.trim();
    if (!text) {
      console.error("[ChatSocket] Cannot send empty message");
      this.onError?.({
        code: "EMPTY_MESSAGE",
        message: "Message cannot be empty.",
      });
      return false;
    }

    console.log("[ChatSocket] Sending message:", text);
    this.socket.send(JSON.stringify({ content: text }));
    return true;
  }

  close() {
    console.log("[ChatSocket] Closing socket manually");
    this.manuallyClosed = true;
    this.baseCandidates = [];
    this.currentBaseIndex = 0;
    this.connectionOpened = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
