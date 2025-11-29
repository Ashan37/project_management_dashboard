import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/authStore";

export default function useSocket(onEvent) {
  const socketRef = useRef(null);
  const token = useAuthStore.getState().token;

  useEffect(() => {
    if (!token) return;
    const socket = io("http://localhost:5000", {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {});

    socket.on("refreshKanban", (data) => {
      if (onEvent) onEvent(data);
    });

    socket.on("refreshTasks", (data) => {
      if (onEvent) onEvent(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, onEvent]);

  return socketRef;
}
