import React from "react";
import ReactPlayer from "react-player";

export default function Demo() {
  return (
    <>
      <h1>Demo</h1>
      <ReactPlayer
        url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
        playing
        height="50%"
        width="50%"
      />
    </>
  );
}
