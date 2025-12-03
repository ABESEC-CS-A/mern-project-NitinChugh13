// src/components/Background.jsx
import React from "react";
import back1 from "../assets/back1.jpg";
import back2 from "../assets/back2.jpg";
import back3 from "../assets/back3.jpg";
import back4 from "../assets/back4.jpg";

const images = [back1, back2, back3, back4];

function Background({ heroCount }) {
  const currentImage = images[heroCount] ?? images[0];

  return (
    <img
      src={currentImage}
      alt=""
      className="h-full w-full object-cover"
    />
  );
}

export default Background;
