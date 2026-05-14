import { useState, useRef } from "react";
import Canvas from "./canvas.jsx";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const [mouseDown, setMouseDown] = useState(false);

  document.addEventListener(
    "mousedown",
    (event) => {
      setMouseDown(true);
      console.log("Mouse down at:", event.clientX, event.clientY);
    },
    false,
  );

  document.addEventListener(
    "mouseup",
    (event) => {
      setMouseDown(false);
      console.log("Mouse up at:", event.clientX, event.clientY);
    },
    false,
  );

  document.addEventListener("mousemove", (event) => {
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  });

  const draw = (ctx, canvas) => {
    //works kinda
    if (mouseDown) {
      ctx.fillStyle = "black";
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
      console.log("Drawing at:", mouseX, mouseY);
    } else {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <>
      <div className="App">
        <Canvas className="canvas" draw={draw} />
      </div>
    </>
  );
}

export default App;
