import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return socket;
}

