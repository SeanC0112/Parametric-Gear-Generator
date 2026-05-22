export function generateGearsFromPath(path, baseRadius, toothScalar) {
  let xPath = [];
  let yPath = [];

  let length = path.length;

  let minX = Math.min(...path.map((point) => point.x));
  let minY = Math.min(...path.map((point) => point.y));

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

  return { xPath, yPath };
}
