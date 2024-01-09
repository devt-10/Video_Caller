import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { myCustomUseSocketHook } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";
function Lobby() {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = myCustomUseSocketHook();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleRoomJoin = useCallback((data) => {
    const { email, room } = data; //same data received after making an entry in the two maps);
    navigate(`/room/${room}`);
  }, []);

  useEffect(() => {
    socket.on("room:join", handleRoomJoin);
    return () => {
      socket.off("room:join", handleRoomJoin);
    };
  }, [socket]);

  return (
    <>
      <h1>Lobby</h1>
      <form method="POST" action="" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="room">Room</label>
          <input
            type="text"
            id="room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>
        <button>Submit</button>
      </form>
    </>
  );
}

export default Lobby;
