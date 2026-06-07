import { useState, useRef, useEffect, useCallback, use } from 'react';
import Canvas from './canvas.jsx';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import { generateGearsFromPath } from './util.js';
import './App.css';

function App() {
  const [mousePositions, setMousePositions] = useState([]);
  const [savedMousePositions, setSavedMousePositions] = useState([]);

  const [gearOne, setGearOne] = useState([]);
  const [gearTwo, setGearTwo] = useState([]);

  const [mouseDown, setMouseDown] = useState(false);
  const prevMouseDown = useRef(false);
  const animationFrameId = useRef(null);

  const [isSubmit, setIsSubmit] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);

  const [animationStart, setAnimationStart] = useState(0);

  const handleSubmit = useCallback(() => {
    console.log(mousePositions);

    if (mousePositions.length > 1) {
      setSavedMousePositions(mousePositions.slice(0, -2));
      console.log(mousePositions);
      console.log('hi');
      const { xPath, yPath } = generateGearsFromPath(
        mousePositions.slice(0, -2),
        50
      );
      setGearOne(xPath);
      setGearTwo(yPath);
      setIsSubmit(true);
    }
  }, [mousePositions, setMousePositions]);

  const handleAnimate = useCallback(() => {
    setIsAnimate(true);
    setAnimationStart(performance.now());
  }, [setIsAnimate, setAnimationStart]);

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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setMousePositions([]);
      } else if (mouseDown && !isOverButton) {
        if (mousePositions.length > 2) {
          const prevPos = mousePositions[mousePositions.length - 2];
          const pos = mousePositions[mousePositions.length - 1];
          // moveTo(prevPos.x, prevPos.y);
          ctx.strokeStyle = 'white';

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

  const drawCircle = (ctx, canvas, x, y, radius, fillStyle) => {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  };

  const drawGear = (ctx, canvas, gear, centerX, centerY, angle, scale) => {
    ctx.save();

    ctx.translate(centerX, centerY);

    angle = (angle * Math.PI) / 180;
    ctx.rotate(angle);

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';

    drawCircle(ctx, canvas, 0, 0, 10, 'white');

    ctx.beginPath();

    gear.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x * scale, point.y * scale);
      } else {
        ctx.lineTo(point.x * scale, point.y * scale);
      }
    });

    ctx.stroke();

    ctx.restore();
  };

  const drawGears = useCallback(
    (ctx, canvas) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // ctx.fillStyle = 'white';
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGear(ctx, canvas, gearOne, canvas.width / 4, canvas.height / 2, 0, 1);

      drawGear(
        ctx,
        canvas,
        gearTwo,
        (3 * canvas.width) / 4,
        canvas.height / 2,
        0,
        1
      );
    },
    [gearOne, gearTwo]
  );

  const animateGears = useCallback(
    (ctx, canvas) => {
      let fps = 60;
      let currentTime = performance.now();
      let deltaTime = currentTime - animationStart;
      let angle = (deltaTime / 1000) * fps; // Rotate 60 degrees per second
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGear(
        ctx,
        canvas,
        gearOne,
        canvas.width / 4,
        canvas.height / 2,
        angle,
        1
      );

      drawGear(
        ctx,
        canvas,
        gearTwo,
        (3 * canvas.width) / 4,
        canvas.height / 2,
        angle,
        1
      );
    },
    [gearOne, gearTwo, animationStart]
  );

  return isSubmit ? (
    <div className="gears-output">
      {isAnimate ? (
        <Canvas
          className="gears-canvas w-full h-full block"
          draw={animateGears}
        />
      ) : (
        <>
          <button className="submit-button" onClick={handleAnimate}>
            Animate
          </button>
          <Canvas
            className="gears-canvas w-full h-full block"
            draw={drawGears}
          />
        </>
      )}
    </div>
  ) : (
    <div className="canvas-container">
      <p className="instruction-text">
        Draw shape to be converted to parametric equation
      </p>
      <Canvas className="w-full h-full block" draw={draw} />
      <button ref={buttonRef} className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default App;
