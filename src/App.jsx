import { useState, useRef, useEffect } from "react";
import Canvas from "./canvas.jsx";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const [mousePositions, setMousePositions] = useState([]);

  const [mouseDown, setMouseDown] = useState(false);
  const [prevMouseDown, setPrevMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseDown = (event) => {
      setMouseDown(true);
      // console.log("Mouse down at:", event.clientX, event.clientY);
    };

    const handleMouseUp = (event) => {
      setMouseDown(false);
      setMousePositions([]);
      // console.log("Mouse up at:", event.clientX, event.clientY);
    };

    const handleMouseMove = (event) => {
      setMouseDown((prevMouseDown) => {
        if (prevMouseDown) {
          setMousePositions((prevPositions) => [
            ...prevPositions,
            { x: event.clientX, y: event.clientY },
          ]);
        }
        return prevMouseDown;
      });
    };

    document.addEventListener("mousedown", handleMouseDown, false);
    document.addEventListener("mouseup", handleMouseUp, false);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown, false);
      document.removeEventListener("mouseup", handleMouseUp, false);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const draw = (ctx, canvas) => {
    if (!prevMouseDown && mouseDown) {
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (mouseDown) {
      ctx.fillStyle = "black";
      if (mousePositions.length > 1) {
        const prevPos = mousePositions[mousePositions.length - 2];
        const pos = mousePositions[mousePositions.length - 1];
        moveTo(prevPos.x, prevPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    }
    setPrevMouseDown(mouseDown);
  };

  return (
    <>
      <div className="w-full h-full">
        <Canvas className="w-full h-full block" draw={draw} />
      </div>
    </>
  );
}

export default App;
