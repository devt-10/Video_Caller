import React, { useCallback, useEffect, useState, useRef } from "react";
import { myCustomUseSocketHook } from "../context/SocketProvider";
import peer from "../services/peer";
import toast from "react-hot-toast";

const Room = () => {
  const socket = myCustomUseSocketHook();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [callMaker, setCallMaker] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const videoRef = useRef(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`User with email ${email} joined!`);
    // console.log("ID:", id);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    const offer = await peer.makeOffer();
    setCallMaker(true);
    socket.emit("user:call", { to: remoteSocketId, offer });
    // console.log(`Remote ${remoteSocketId}`);

    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log("incomgin call", from, offer);
      const ans = await peer.makeAns(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStream = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStream();
    },
    [sendStream]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.makeOffer();
    socket.emit("nego:needed", { to: remoteSocketId, offer });
  }, [socket, remoteSocketId]);

  const handleNegoIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.makeAns(offer);
      socket.emit("nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  });

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    // peer.peer.addEventListener("negotiationincoming",handleNegoIncoming);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
      // peer.peer.removeEventListener("negotiationincoming", handleNegoIncoming);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("nego:needed", handleNegoIncoming);
    socket.on("nego:final", handleNegoFinal);
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("nego:needed", handleNegoIncoming);
      socket.off("nego:final", handleNegoFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoIncoming,
    handleNegoFinal,
  ]);

  useEffect(() => {
    if (myStream && videoRef.current) {
      videoRef.current.srcObject = myStream;
    }
    if (remoteStream && videoRef.current) {
      videoRef.current.srcObject = remoteStream;
    }
  }, [myStream, remoteStream]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-6">
      <h4 className="mb-4 text-3xl text-center text-white">
        {remoteSocketId ? (
          <div className="flex flex-col items-center justify-center w-full p-6 space-y-4 text-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text">
            <span>Yay, we found an expert for you!</span>
          </div>
        ) : (
          <span>No one in the room.</span>
        )}
      </h4>
      {remoteSocketId && (
        <button
          className={`px-8 py-4 text-lg font-semibold text-white transition duration-300 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            myStream && "hidden"
          }`}
          onClick={handleCallUser}
        >
          Say Hello!
        </button>
      )}
      {myStream && (
        <button
          className={`px-8 py-4 text-lg font-semibold text-white transition duration-300 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            callMaker ? "hidden" : ""
          }`}
          onClick={handleCallUser}
        >
          Accept Call
        </button>
      )}
      <div className="flex gap-96">
        {myStream && (
          <div className="mt-4">
            <h1 className="mb-2 text-xl font-bold text-white">My Stream</h1>
            <video
              ref={videoRef}
              width="300px"
              height="150px"
              autoPlay
              playsInline
              className="border-2 rounded-md border-black"
            ></video>
          </div>
        )}
        {remoteStream && (
          <div className="mt-4">
            <h1 className="mb-2 text-xl font-bold text-white">Remote Stream</h1>
            <video
              ref={videoRef}
              width="300px"
              height="150px"
              autoPlay
              playsInline
              className="border-2 rounded-md border-black"
            ></video>
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;
