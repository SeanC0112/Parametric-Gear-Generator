import { useState, useRef, useEffect, useCallback, use } from 'react';
import Canvas from './canvas.jsx';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import { generateGearsFromPath } from './util.js';
import './App.css';

function App() {
  const [mousePositions, setMousePositions] = useState([]);
  const [gearOne, setGearOne] = useState([]);
  const [gearTwo, setGearTwo] = useState([]);

  const [mouseDown, setMouseDown] = useState(false);
  const prevMouseDown = useRef(false);
  const animationFrameId = useRef(null);

  const [isSubmit, setIsSubmit] = useState(false);

  const handleSubmit = useCallback(() => {
    console.log(mousePositions);

    if (mousePositions.length > 1) {
      const { xPath, yPath } = generateGearsFromPath(mousePositions, 50, 0.5);
      setGearOne(xPath);
      setGearTwo(yPath);
      setIsSubmit(true);
    }
  }, [mousePositions]);

  const buttonRef = useRef(null);
  const [isOverButton, setIsOverButton] = useState(false);

  useEffect(() => {
    const el = buttonRef.current;

    const handleMouseEnter = () => setIsOverButton(true);
    const handleMouseLeave = () => setIsOverButton(false);

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleMouseDown = (event) => {
      setMouseDown(true);
      // console.log("Mouse down at:", event.clientX, event.clientY);
    };

    const handleMouseUp = (event) => {
      setMouseDown(false);
      // console.log("Mouse up at:", event.clientX, event.clientY);
    };

    const handleMouseMove = (event) => {
      setMouseDown((prevMouseDown) => {
        if (prevMouseDown) {
          setMousePositions((prevPositions) => {
            const newPositions = [
              ...prevPositions,
              { x: event.clientX, y: event.clientY },
            ];
            // Keep only last 1000 positions to prevent memory buildup
            return newPositions;
          });
        }
        return prevMouseDown;
      });
    };

    document.addEventListener('mousedown', handleMouseDown, false);
    document.addEventListener('mouseup', handleMouseUp, false);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, false);
      document.removeEventListener('mouseup', handleMouseUp, false);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const draw = useCallback(
    (ctx, canvas) => {
      if (!prevMouseDown.current && mouseDown && !isOverButton) {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setMousePositions([]);
      } else if (mouseDown && !isOverButton) {
        ctx.fillStyle = 'black';
        if (mousePositions.length > 2) {
          const prevPos = mousePositions[mousePositions.length - 2];
          const pos = mousePositions[mousePositions.length - 1];
          // moveTo(prevPos.x, prevPos.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
        } else if (mousePositions.length > 1) {
          const pos = mousePositions[0];
          ctx.beginPath();
          // ctx.moveTo(pos.x, pos.y);
        }
      }
      prevMouseDown.current = mouseDown;
    },
    [mouseDown, mousePositions, isOverButton]
  );

  const drawGears = useCallback(
    (ctx, canvas) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(canvas.width / 4, canvas.height / 2, 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc((3 * canvas.width) / 4, canvas.height / 2, 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      gearOne.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x + canvas.width / 4, point.y + canvas.height / 2);
        } else {
          ctx.lineTo(point.x + canvas.width / 4, point.y + canvas.height / 2);
        }
      });
      gearTwo.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(
            point.x + (3 * canvas.width) / 4,
            point.y + canvas.height / 2
          );
        } else {
          ctx.lineTo(
            point.x + (3 * canvas.width) / 4,
            point.y + canvas.height / 2
          );
        }
      });
      ctx.stroke();
      console.log(gearOne);
    },
    [gearOne, gearTwo]
  );

  return isSubmit ? (
    <Canvas className="w-full h-full block" draw={drawGears} />
  ) : (
    <>
      <div className="w-full h-full">
        <p className="text-2xl text-center mt-4 fixed">
          Draw shape to be converted to parametric equation
        </p>
        <Canvas className="w-full h-full block" draw={draw} />
        <button
          ref={buttonRef}
          className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded fixed"
          onClick={handleSubmit}
        >
          {' '}
          Submit{' '}
        </button>
      </div>
    </>
  );
}

export default App;
