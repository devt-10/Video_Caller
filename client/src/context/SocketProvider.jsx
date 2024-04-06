import react, { useMemo } from "react";
import { useContext, createContext } from "react";
import { io } from "socket.io-client";

export const myCustomUseSocketHook = () => {
  const socket = useContext(SocketContext);
  return socket;
};
const SocketContext = createContext(null);
export const SocketProvider = (props) => {
  const socket = useMemo(() => io("https://video-caller.onrender.com"), []);
  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
