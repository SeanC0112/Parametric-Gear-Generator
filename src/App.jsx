import { useState } from "react";
import Canvas from "./canvas.jsx";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const draw = (ctx, canvas) => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 20, 30);
  };

  return (
    <>
      <div>
        <Canvas className="canvas" draw={draw} width={100} height={100} />
      </div>
    </>
  );
}

export default App;
