export function generateGearsFromPath(path, baseRadius, normScalar) {
  let xPath = [];
  let yPath = [];

  let length = path.length;

  let minX = Math.min(...path.map((point) => point.x));
  let maxX = Math.max(...path.map((point) => point.x));
  let minY = Math.min(...path.map((point) => point.y));
  let maxY = Math.max(...path.map((point) => point.y));

  //normalize size
  // let toothScalar = Math.min(200 / Math.max(maxX - minX, maxY - minY), 1);
  let toothScalar = normScalar / Math.max(maxX - minX, maxY - minY);

  path.forEach((point, index) => {
    xPath.push({
      x:
        (baseRadius + (point.x - minX) * toothScalar) *
        Math.cos(-(index / (length - 1)) * 2 * Math.PI),
      y:
        (baseRadius + (point.x - minX) * toothScalar) *
        Math.sin(-(index / (length - 1)) * 2 * Math.PI),
    });

    yPath.push({
      x:
        (baseRadius + (point.y - minY) * toothScalar) *
        Math.cos(-(index / (length - 1)) * 2 * Math.PI),
      y:
        (baseRadius + (point.y - minY) * toothScalar) *
        Math.sin(-(index / (length - 1)) * 2 * Math.PI),
    });
  });

  xPath.push(xPath[0]);
  yPath.push(yPath[0]);

  return { xPath, yPath };
}

export function drawCircle(ctx, canvas, x, y, radius, fillStyle) {
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

export function drawLine(ctx, canvas, x1, y1, x2, y2, strokeStyle) {
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function drawGear(ctx, canvas, gear, centerX, centerY, angle, scale) {
  ctx.save();

  ctx.translate(centerX, centerY);

  angle = (angle * Math.PI) / 180;
  ctx.rotate(angle);

  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';

  ctx.beginPath();

  gear.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x * scale, point.y * scale);
    } else {
      ctx.lineTo(point.x * scale, point.y * scale);
    }
  });
  ctx.fill();
  ctx.stroke();

  drawCircle(ctx, canvas, 0, 0, 10, '#0f3460');

  ctx.restore();
}
