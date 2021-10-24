function lerp(start, end, amt) {
  return Math.round(((1 - amt) * start + amt * end)*100)/100;
}
function quadraticEaseInOut(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
function exponentialEaseInOut(x) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? Math.pow(2, 20 * x - 10) / 2
    : (2 - Math.pow(2, -20 * x + 10)) / 2;
}
function bounce(x) {
  const n1 = 7.5625;
  const d1 = 2.75;
  
  if (x < 1 / d1) {
      return n1 * x * x;
  } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
  }
function linear(x) {
  return x;
}
var points = {
  data: [
    [531, 451],
    [138, 451],
    [531, 114],
    [138, 114],
  ],

  computed: [],
};
/*for (let i = 0; i < points.data.length; i++) {
  for (let j = 0; j < points.data.length; j++)
  points.computed.push([0])
}*/
var save = {
  get: function () {
    return JSON.parse(localStorage.getItem("bezierSaveData"));
  },
  set: function () {
    return localStorage.setItem("bezierSaveData", JSON.stringify(points));
  },
};

if (localStorage.getItem("bezierBannerState"))
  document.querySelector(".banner").remove();

if (!save.get()) {
  save.set();
} else {
  points = save.get();
}
var playing = true
var canv = document.getElementById("canvas"),
  ctx = canv.getContext("2d"),
  canv2 = document.getElementById("canvas2"),
  ctx2 = canv2.getContext("2d"),
  background = "#000020",
  t = 0,
  speed = 0.002,
  easedT,
  inter,
  easeSelected = window["quadraticEaseInOut"];

//var iteration = 0;

(canv.height = window.innerHeight), (canv.width = window.innerWidth);
(canv2.height = window.innerHeight), (canv2.width = window.innerWidth);
onresize = () => {
  canv.height = window.innerHeight;
  canv.width = window.innerWidth;
  (canv2.height = window.innerHeight), (canv2.width = window.innerWidth);
  advance(easeSelected);
};
class Point {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    point(x, y, radius);
  }
}

function point(x, y, rad, col) {
  ctx.beginPath();

  ctx.arc(x, y, rad, 0, 2 * Math.PI, true);
  ctx.closePath();
  if (!col) ctx.fillStyle = "#ffffff";
  else ctx.fillStyle = col;
  ctx.fill();
}
function line(startx, starty, finishx, finishy) {
  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.moveTo(startx, starty, 0);
  ctx.lineTo(finishx, finishy);
  ctx.stroke(); // Bottom side line
}
function stp(y) {
  clearInterval(inter);
  if (t >= 1 || y == true) (t = 0), (playing = false), evaluatePlaying();
}
strt(true);
function strt(refresh) {
  clearCanvas();
  if (!refresh) clearTrail(), stp(true);
  inter = setInterval(function () {
    advance(easeSelected);
  }, 10);
}
function evaluatePlaying() {
  if (playing == true)
    strt(true), (document.getElementById("playBtn").innerHTML = "Stop");
  else stp(), (document.getElementById("playBtn").innerHTML = "Play");
}
function replay() {
  clearInterval(inter);
  t = 1;
  strt(), (document.getElementById("playBtn").innerHTML = "Stop");
  playing = true;
}
function advance(ease) {
  clearCanvas();
  document.getElementById('speedometer').innerHTML = 't='+ease(t).toFixed(4)
  if (t >= 1) stp();
  t += speed;
  easedT = ease(t);
  new Point(points.data[0][0], points.data[0][1], 10, 'coral'); // Anchor dot
  new Point(points.data[1][0], points.data[1][1], 10, 'magenta'); // Right side anchor dot
  new Point(points.data[2][0], points.data[2][1], 10, 'dodgerblue'); // bottom side anchor dot
  new Point(points.data[3][0], points.data[3][1], 10, 'mint'); // bottom right side anchor dot

  line(points.data[2][0], points.data[2][1], points.data[3][0], points.data[3][1]);
  line(points.data[0][0], points.data[0][1], points.data[2][0], points.data[2][1]);
  line(points.data[1][0], points.data[1][1], points.data[3][0], points.data[3][1]);
 // drawAndConnectInitialPoints();
  //getFirstMidPoints();
  //drawMidPoints();
   let topMiddlePointX = lerp(points.data[0][0], points.data[2][0], easedT);
  let topMiddlePointY = lerp(points.data[0][1], points.data[2][1], easedT);
  new Point(topMiddlePointX, topMiddlePointY, 5);

  let middleBottomPointX = lerp(points.data[2][0], points.data[3][0], easedT);
  let middleBottomPointY = lerp(points.data[2][1], points.data[3][1], easedT);
  new Point(middleBottomPointX, middleBottomPointY, 5);

  let bottomRightPointX = lerp(points.data[3][0], points.data[1][0], easedT);
  let bottomRightPointY = lerp(points.data[3][1], points.data[1][1], easedT);
  new Point(bottomRightPointX, bottomRightPointY, 5);
  

  line(
    topMiddlePointX,
    topMiddlePointY,
    middleBottomPointX,
    middleBottomPointY
  );
  line(
    middleBottomPointX,
    middleBottomPointY,
    bottomRightPointX,
    bottomRightPointY
  );

  let midpoint1X = lerp(topMiddlePointX, middleBottomPointX, easedT);
  let midpoint1Y = lerp(topMiddlePointY, middleBottomPointY, easedT);
  new Point(midpoint1X, midpoint1Y, 5);

  let midpoint2X = lerp(middleBottomPointX, bottomRightPointX, easedT);
  let midpoint2Y = lerp(middleBottomPointY, bottomRightPointY, easedT);
  new Point(midpoint2X, midpoint2Y, 5);
  line(midpoint1X, midpoint1Y, midpoint2X, midpoint2Y);
  let finalMidPointX = lerp(midpoint1X, midpoint2X, easedT);
  let finalMidPointY = lerp(midpoint1Y, midpoint2Y, easedT);
  new Point(finalMidPointX, finalMidPointY, 10);
  /*
  Trail
  */
  ctx2.beginPath();
  ctx2.fillStyle = "#ffffff";
 ctx2.arc(finalMidPointX, finalMidPointY, 10, 0, 2 * Math.PI, true);
  ctx2.closePath();
  ctx2.fill();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canv.width, canv.height);
}
function clearTrail() {
  ctx2.clearRect(0, 0, canv.width, canv.height);
}
function resetCurve() {
  points = {
    data: [
      [531, 351],
      [138, 351],
      [531, 14],
      [138, 14],
    ],
  };
  advance(easeSelected)
  save.set();
}

var mouseIsDown = false
var dragging = -1
onmousedown = () => {
  mouseIsDown = true;
};
ontouchstart = () => {
  mouseIsDown = true;
  console.log(mouseIsDown);
};

onmouseup = () => {
  mouseIsDown = false;
  dragging = -1;
};
onmousemove = (e) => {
  pointHandler(e);
};
ontouchmove = (e) => {
  pointHandler(e.touches[0]);
};
function pointHandler(windowEvent) {
  if (mouseIsDown == true) {
    console.log(mouseIsDown)
    var x = windowEvent.clientX
    var y = windowEvent.clientY
    for (let i = 0; i < points.data.length; i++) {
      if (
        ((x >= points.data[i][0] && x <= points.data[i][0] + 30) ||
          (x <= points.data[i][0] && x >= points.data[i][0] - 30)) &&
        ((y >= points.data[i][1] && y <= points.data[i][1] + 30) ||
          (y <= points.data[i][1] && y >= points.data[i][1] - 30))
          || dragging == i
      ) {
        dragging = i;
        if (dragging == i) {
          if (x < 0) break;
          if (y < 0) break;
          if (x > window.innerWidth) break;
          if (y > window.innerHeight) break;
          points.data[i][0] = x;
          points.data[i][1] = y;
          clearCanvas();
         // drawAndConnectInitialPoints();
         new Point(points.data[0][0], points.data[0][1], 10, 'coral'); // Anchor dot
          new Point(points.data[1][0], points.data[1][1], 10, 'magenta'); // Right side anchor dot
          new Point(points.data[2][0], points.data[2][1], 10, 'dodgerblue'); // bottom side anchor dot
          new Point(points.data[3][0], points.data[3][1], 10, 'mint'); // bottom right side anchor dot
        
          line(points.data[2][0], points.data[2][1], points.data[3][0], points.data[3][1]);
          line(points.data[0][0], points.data[0][1], points.data[2][0], points.data[2][1]);
          line(points.data[1][0], points.data[1][1], points.data[3][0], points.data[3][1]);

          save.set();

          break;
        }
      }
    }
  }
}
function drawAndConnectInitialPoints() {
  for (let i = 0; i < points.data.length; i++) {
    new Point(points.data[i][0], points.data[i][1], 10, "white"); // Anchor dots
  }
  for (let i = 0; i < points.data.length - 1; i++) {
    line(
      points.data[i][0],
      points.data[i][1],
      points.data[i + 1][0],
      points.data[i + 1][1]
    );
  }
}
function getFirstMidPoints() {
  for (let i = 0; i < points.data.length; i++) {
    if (i == points.data.length - 1) {
      break
    }
    points.computed[i][0] = lerp(
      points.data[i][0],
      points.data[i + 1][0],
      easedT
    );
    points.computed[i][1] = lerp(
      points.data[i][1],
      points.data[i + 1][1],
      easedT
    );
  }
}
function drawMidPoints() {
  for (let i = 0; i < points.computed.length; i++) {
    new Point(points.computed[i][0],points.computed[i][1],5)
      if (i != points.computed.length - 1) line(
        points.computed[i + 1][0], points.computed[i + 1][1],
        points.computed[i][0], points.computed[i][1]
      )
  }
}
document.getElementById("easeOption").oninput = () => {
  easeSelected = window[document.getElementById("easeOption").value];
};
