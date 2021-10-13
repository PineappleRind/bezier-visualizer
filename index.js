function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}
function easeInOutCubic(x) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? Math.pow(2, 20 * x - 10) / 2
    : (2 - Math.pow(2, -20 * x + 10)) / 2;
}
var firstPoint = [600, 900];
var secondPoint = [1300, 400];
var thirdPoint = [400, 700];

let canv = document.getElementById("canvas"),
  ctx = canv.getContext("2d"),
  canv2 = document.getElementById("canvas2"),
  ctx2 = canv2.getContext("2d"),
  background = "#000020",
  t = 0;

(canv.height = window.innerHeight), (canv.width = window.innerWidth);
(canv2.height = window.innerHeight), (canv2.width = window.innerWidth);
class Point {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    point(x, y, radius);
  }
}

function point(x, y, rad) {
  ctx.beginPath();
  ctx.fillStyle = "#ffffff";
  ctx.arc(x, y, rad, 0, 2 * Math.PI, true);
  ctx.closePath();
  ctx.fill();
}
function line(start, finish) {
  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.moveTo(firstPoint[0], firstPoint[1], 0);
  ctx.lineTo(thirdPoint[0], thirdPoint[1]);
  ctx.stroke(); // Bottom side line
}
function advance() {
  clearCanvas();
  if (t >= 1) clearInterval(inter);
  t = t + 0.001;
  easedT = easeInOutCubic(t);

  new Point(firstPoint[0], firstPoint[1], 10); // Anchor dot
  new Point(secondPoint[0], secondPoint[1], 10); // Right side anchor dot

  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.moveTo(firstPoint[0], firstPoint[1], 0);
  ctx.lineTo(secondPoint[0], secondPoint[1]);
  ctx.stroke(); // Right side line

  let calcedX1 = lerp(firstPoint[0], secondPoint[0], easedT);
  let calcedY1 = lerp(firstPoint[1], secondPoint[1], easedT);
  new Point(calcedX1, calcedY1, 5); // Right side midpoint dot

  new Point(thirdPoint[0], thirdPoint[1], 10); // Bottom side anchor dot

  line(firstPoint[0], firstPoint[1], thirdPoint[0], thirdPoint[1]);

  let calcedX2 = lerp(thirdPoint[0], firstPoint[0], easedT);
  let calcedY2 = lerp(thirdPoint[1], firstPoint[1], easedT);
  new Point(calcedX2, calcedY2, 5); // Bottom side midpoint dot

  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.moveTo(calcedX1, calcedY1, 0);
  ctx.lineTo(calcedX2, calcedY2);
  ctx.stroke();

  let finalCalcX = lerp(calcedX1, calcedX2, Math.abs(easedT - 1));
  let finalCalcY = lerp(calcedY1, calcedY2, Math.abs(easedT - 1));

  /*Trail*/
  ctx2.beginPath();
  ctx2.fillStyle = "white";
  ctx2.arc(finalCalcX, finalCalcY, 10, 0, 2 * Math.PI, true);
  ctx2.closePath();
  ctx2.fill();

  new Point(finalCalcX, finalCalcY, 5); // Final curve dot
}

function clearCanvas() {
  ctx.fillStyle = "#000020";
  ctx.fillRect(0, 0, canv.width, canv.height);
}
let inter = setInterval(function () {
  advance();
});
new Point(100, 100);
new Point(300, 200);
