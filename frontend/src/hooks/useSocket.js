import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io("https://inventoryapp-7qmg.onrender.com", { transports: ["websocket"] });
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return socket;
}
