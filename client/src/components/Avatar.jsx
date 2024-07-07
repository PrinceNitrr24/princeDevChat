import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Avatar = ({ userId, name, imageUrl, width, height }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  // Define an array of gradient colors
  const gradientColors = [
    "linear-gradient(45deg, #98DE0A, #0C1101)",
    "linear-gradient(45deg, #0C1101, #98DE0A)",
    "linear-gradient(45deg, #98DE0A, #3D5A80)",
    "linear-gradient(45deg, #3D5A80, #98DE0A)",
    "linear-gradient(45deg, #98DE0A, #FFC300)",
    "linear-gradient(45deg, #FFC300, #98DE0A)",
    "linear-gradient(45deg, #98DE0A, #FF6B6B)",
    "linear-gradient(45deg, #FF6B6B, #98DE0A)",
    "linear-gradient(45deg, #98DE0A, #FF5733)",
    "linear-gradient(45deg, #FF5733, #98DE0A)",
  ];

  // State to store the selected gradient color
  const [selectedGradient, setSelectedGradient] = useState("");

  // Select a random gradient color when the component mounts
  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * gradientColors.length);
    setSelectedGradient(gradientColors[randomNumber]);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const isOnline = onlineUser.includes(userId);

  return (
    <div
      className="text-slate-800  rounded-full relative"
      style={{
        width: width + "px",
        height: height + "px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          className="overflow-hidden rounded-full"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      ) : name ? (
        <div
          style={{
            width: width + "px",
            height: height + "px",
            background: selectedGradient, // Use selected gradient color here
          }}
          className="overflow-hidden rounded-full font-bold flex justify-center items-center text-lg"
        >
          {name.charAt(0)}
        </div>
      ) : (
        <div className="w-fit mx-auto mb-1">
          <img
            className="rounded-full"
            src="./go.gif"
            alt="user"
            width={100}
            height={100}
          />
        </div>
      )}
      {isOnline && (
        <div className="bg-green-600 p-1 absolute bottom-2 -right-0 rounded-full">
          
        </div>
      )}
    </div>
  );
};

export default Avatar;
