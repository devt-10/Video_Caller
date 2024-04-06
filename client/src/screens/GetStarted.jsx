import React from "react";
import Navbar from "../components/Navbar";
//import button from d

export default function GetStarted() {
  function getMouseCoordinates(e) {
    const blob = document.getElementById("blob");
    const squareToBeBlurred = document.getElementById("squareToBeBlurred");
    const envelope = document.getElementById("envelope");
    const xc = e.clientX;
    const yc = e.clientY;
    blob.animate(
      {
        left: `${xc}px`,
        top: `${yc}px`,
      },
      { duration: 3000, fill: "forwards" }
    );
  }

  function handleGetStarted() {
    // window.location.href = "/room";
    const button = document.getElementById("get-started-button");
    //add classname to button
    button.classList.add("hidden");
    const loadingButton = document.getElementById("loading-button");
    loadingButton.classList.remove("hidden");
    //wait for 5 seconds and then redirect
    setTimeout(() => {
      window.location.href = "/lobby";
    }, 4000);
  }

  return (
    <div className="flex justify-center items-center">
      <style>
        {`
          @keyframes spin_and_grow {
            0% {
              transform: rotate(0deg) scale(1);
            }
            50% {
              transform: rotate(180deg) scale(1,1.5);
            }
            100% {
              transform: rotate(360deg) scale(1);
            }
          }

          .animate-spin_and_grow {
            animation: spin_and_grow 10s linear infinite; /* Adjust duration and timing function as needed */
          }
        `}
      </style>
      <div
        className="w-full h-screen bg-black"
        id="container"
        onMouseMove={getMouseCoordinates}
      >
        <Navbar></Navbar>
        <div className="absolute" id="blur">
          <div
            className="h-40 w-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 rounded-full fixed animate-spin_and_grow blur-3xl"
            id="blob"
          ></div>
        </div>
        <div className="flex-col p-16  h-2/4">
          <div className=" m-2 h-min flex justify-center items-center">
            <h1 className="font-extralight text-5xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text ">
              Consult with our experts.
            </h1>
          </div>
          <div className=" m-2 h-min flex justify-center items-center">
            <h3 className="text-white font-extralight">
              Don't trust our AI? Don't worry we've got you covered.
            </h3>
          </div>
          <div className="flex justify-center items-center mt-10">
            {/* <button class="btn glass">Get Started -></button> */}
            <button
              className="btn glass"
              onClick={handleGetStarted}
              id="get-started-button"
            >
              <p className="text-gray-300 font-extralight hover:text-white">Get Started →</p>
            </button>
            <button className="btn glass hidden" id="loading-button">
              <span className="loading loading-spinner font-extralight"></span>
              <p className="font-extralight">Loading...</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
