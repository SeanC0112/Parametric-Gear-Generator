import { useState, useRef, useEffect, useCallback, use } from 'react';
import Canvas from './canvas.jsx';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import {
  generateGearsFromPath,
  drawCircle,
  drawGear,
  drawLine,
} from './util.js';
import './App.css';

function App() {
  const [mousePositions, setMousePositions] = useState([]);
  const [savedMousePositions, setSavedMousePositions] = useState([]);

  const drawPositionsRef = useRef([]);

  const [normScalar, setNormScalar] = useState(0);

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
        50,
        normScalar
      );
      setGearOne(xPath);
      setGearTwo(yPath);
      setIsSubmit(true);
    }
  }, [mousePositions, setMousePositions, normScalar]);

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
      setNormScalar(Math.min(canvas.width, canvas.height) / 5);
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
      let angle = ((deltaTime / 1000) * fps) % 360; // Rotate 60 degrees per second
      if (angle < 1) {
        // Reset when angle < 1
        drawPositionsRef.current = [];
      }

      let gearOneX = canvas.width / 4;
      let gearOneY = (2 * canvas.height) / 3;

      let gearTwoX = (2 * canvas.width) / 3; //move up above center
      let gearTwoY = canvas.height / 4;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawGear(ctx, canvas, gearOne, gearOneX, gearOneY, angle, 1);
      drawGear(ctx, canvas, gearTwo, gearTwoX, gearTwoY, angle + 90, 1);

      let arrLength = gearOne.length;
      let fraqIndex = (angle / 360) * (arrLength - 1);
      let prevIndex = Math.floor(fraqIndex) % (arrLength - 1);
      let nextIndex = (prevIndex + 1) % (arrLength - 1);
      console.log(gearOne.length, gearTwo.length);

      let deltaGearOne =
        (Math.sqrt(
          Math.pow(gearOne[nextIndex].x, 2) + Math.pow(gearOne[nextIndex].y, 2)
        ) -
          Math.sqrt(
            Math.pow(gearOne[prevIndex].x, 2) +
              Math.pow(gearOne[prevIndex].y, 2)
          )) *
        (fraqIndex % 1);

      let gearOneDist =
        Math.sqrt(
          Math.pow(gearOne[nextIndex].x, 2) + Math.pow(gearOne[nextIndex].y, 2)
        ) + deltaGearOne;

      let deltaGearTwo =
        (Math.sqrt(
          Math.pow(gearTwo[nextIndex].x, 2) + Math.pow(gearTwo[nextIndex].y, 2)
        ) -
          Math.sqrt(
            Math.pow(gearTwo[prevIndex].x, 2) +
              Math.pow(gearTwo[prevIndex].y, 2)
          )) *
        (fraqIndex % 1);

      let gearTwoDist =
        Math.sqrt(
          Math.pow(gearTwo[nextIndex].x, 2) + Math.pow(gearTwo[nextIndex].y, 2)
        ) + deltaGearTwo;

      //TODO yay magic numbers i need to fix (half of the normalization scalar fo the gear gen code)
      let horizontalLineLength =
        (gearTwoX - gearOneX - normScalar / 2 - 25) / 3;
      let verticalLineLength = (gearOneY - gearTwoY - normScalar / 2 - 25) / 3;

      let blockerLineLength = 75 + normScalar;

      //First lines

      drawLine(
        ctx,
        canvas,
        gearOneX + gearOneDist,
        gearOneY,
        gearOneX + gearOneDist + horizontalLineLength,
        gearOneY,
        'white'
      );
      drawLine(
        ctx,
        canvas,
        gearTwoX,
        gearTwoY + gearTwoDist,
        gearTwoX,
        gearTwoY + gearTwoDist + verticalLineLength,
        'white'
      );

      //blocker lines

      drawLine(
        ctx,
        canvas,
        gearOneX + gearOneDist + horizontalLineLength,
        gearOneY - blockerLineLength,
        gearOneX + gearOneDist + horizontalLineLength,
        gearOneY + blockerLineLength,
        'white'
      );
      drawLine(
        ctx,
        canvas,
        gearTwoX - blockerLineLength,
        gearTwoY + gearTwoDist + verticalLineLength,
        gearTwoX + blockerLineLength,
        gearTwoY + gearTwoDist + verticalLineLength,
        'white'
      );

      //adjusting lines

      drawLine(
        ctx,
        canvas,
        gearOneX + gearOneDist + horizontalLineLength,
        gearTwoY + gearTwoDist + 2 * verticalLineLength,
        gearOneX + gearOneDist + 2 * horizontalLineLength,
        gearTwoY + gearTwoDist + 2 * verticalLineLength,
        'white'
      );
      drawLine(
        ctx,
        canvas,
        gearOneX + gearOneDist + 2 * horizontalLineLength,
        gearTwoY + gearTwoDist + verticalLineLength,
        gearOneX + gearOneDist + 2 * horizontalLineLength,
        gearTwoY + gearTwoDist + 2 * verticalLineLength,
        'white'
      );

      ctx.strokeStyle = 'white';
      drawPositionsRef.current = [
        ...drawPositionsRef.current,
        {
          x: gearOneX + gearOneDist + 2 * horizontalLineLength,
          y: gearTwoY + gearTwoDist + 2 * verticalLineLength,
        },
      ];

      // Draw immediately (no async wait)
      if (drawPositionsRef.current.length > 1) {
        ctx.beginPath();
        drawPositionsRef.current.forEach((pos, i) => {
          if (i === 0) ctx.moveTo(pos.x, pos.y);
          else ctx.lineTo(pos.x, pos.y);
        });
        ctx.stroke();
      }
    },
    [gearOne, gearTwo, animationStart, normScalar]
  );

  return isSubmit ? (
    <div className="gears-output">
      {isAnimate ? (
        <>
          <Canvas
            className="gears-canvas w-full h-full block"
            draw={animateGears}
          />
          <button
            className="submit-button"
            onClick={() => {
              setIsAnimate(false);
              setIsSubmit(false);
              setMousePositions([]);
              setGearOne([]);
              setGearTwo([]);
              drawPositionsRef.current = [];
            }}
          >
            Draw New Shape
          </button>
        </>
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
