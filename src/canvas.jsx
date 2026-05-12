import React, { useRef, useEffect } from "react";

const Canvas = (props) => {
  const canvasRef = useRef(null);

  const { draw, width, height } = props;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    const render = () => {
      draw(context, canvas);
      window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(render);
    };
  }, [draw, width, height]);

  return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
