import { useEffect } from "react";
import "./Snow.css";

export default function Snow() {
  useEffect(() => {
    const snowContainer = document.getElementById("snow-container");

    for (let i = 0; i < 60; i++) {
      const snowflake = document.createElement("div");
      snowflake.className = "snowflake";
      snowflake.style.left = Math.random() * 100 + "vw";
      snowflake.style.animationDuration = 5 + Math.random() * 10 + "s";
      snowflake.style.opacity = Math.random();
      snowflake.style.fontSize = 8 + Math.random() * 16 + "px";
      snowContainer.appendChild(snowflake);
    }
  }, []);

  return <div id="snow-container"></div>;
}