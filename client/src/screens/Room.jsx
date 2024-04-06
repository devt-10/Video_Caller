import React, { useCallback, useEffect, useState, useRef } from "react";
import { myCustomUseSocketHook } from "../context/SocketProvider";
import peer from "../services/peer";

const Room = () => {
  const socket = myCustomUseSocketHook();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
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
    <>
      <h1>Room</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in the room"}</h4>
      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
      {myStream && <button onClick={sendStream}>Send Stream</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <video
            ref={videoRef}
            width="200px"
            height="100px"
            autoPlay
            playsInline
          ></video>
        </>
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <video
            ref={videoRef}
            width="200px"
            height="100px"
            autoPlay
            playsInline
          ></video>
        </>
      )}
    </>
  );
};

export default Room;
