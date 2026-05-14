import React, { useRef, useEffect, useState } from "react";

const Canvas = (props) => {
  const canvasRef = useRef(null);

  const [parentWidth, setParentWidth] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);

  const { draw } = props;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // canvas.width = width;
    // canvas.height = height;

    const resizeIfNeeded = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const newWidth = parent.clientWidth;
        const newHeight = parent.clientHeight;
        if (newWidth !== parentWidth || newHeight !== parentHeight) {
          setParentWidth(newWidth);
          setParentHeight(newHeight);
          canvas.width = newWidth;
          canvas.height = newHeight;
        }
      }
    };

    const render = () => {
      draw(context, canvas);
      window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(render);
    };
  }, [draw]);

  return <canvas ref={canvasRef} />;
};

export default Canvas;
