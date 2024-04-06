import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { myCustomUseSocketHook } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

  function handleGetStarted() {
    // window.location.href = "/room";
    const button = document.getElementById("get-started-button");
    //add classname to button
    button.classList.add("hidden");
    const loadingButton = document.getElementById("loading-button");
    loadingButton.classList.remove("hidden");
  }
  return (
    <div className="h-[100vh]">
      <div className=" flex justify-center items-center w-full h-full">
        <div className=" m-2 mr-10 h-min flex justify-center items-center">
          <h1 className="font-extralight text-5xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text ">
            Trust. Connect. Grow.
          </h1>
        </div>
        <form method="POST" action="" onSubmit={handleSubmit} className="w-3/5">
          {/* <div>
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
          </div> */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              value={email}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="room"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Room
            </label>
            <input
              type="text"
              id="room"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              placeholder="Enter the room number"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          <button
            className="btn glass"
            onClick={handleGetStarted}
            id="get-started-button"
          >
            <p className="text-gray-300 font-extralight hover:text-white">
              Connect with Expert →
            </p>
          </button>
          <button className="btn glass hidden" id="loading-button">
            <span className="loading loading-spinner font-extralight"></span>
            <p className="font-extralight">Connecting...</p>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Lobby;
