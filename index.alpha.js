function lerp(start, end, amt) {
  return Math.round(((1 - amt) * start + amt * end) * 100) / 100;
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
var colors = ["red", "blue", "lime", "yellow","purple","orange","green","pink","white"];
var points = {
  data: [
    [531, 351],
    [138, 351],
    [531, 14],
    [138, 14],
    [531, 351],
    [138, 351],
    [531, 14],
    [138, 14],
    
  ],

  computed: [],
};
for (var i = 0; i < points.data.length; i++) {
  points.computed.push([points.data[i][0],points.data[i][1]]);
}
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
var playing = true;
var canv = document.getElementById("canvas"),
  ctx = canv.getContext("2d"),
  canv2 = document.getElementById("canvas2"),
  ctx2 = canv2.getContext("2d"),
  background = "#000020",
  t = 0,
  speed = 0.002,
  easedT,
  inter,
  easeSelected = window.quadraticEaseInOut,
  iteration = points.data.length - 1;

(canv.height = window.innerHeight), (canv.width = window.innerWidth);
(canv2.height = window.innerHeight), (canv2.width = window.innerWidth);
onresize = function () {
  canv.height = window.innerHeight;
  canv.width = window.innerWidth;
  (canv2.height = window.innerHeight), (canv2.width = window.innerWidth);
  advance(easeSelected);
};

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
  window.requestAnimationFrame(advance);
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
function advance() {
  clearCanvas();
  document.getElementById("speedometer").innerHTML =
    "t=" + easeSelected(t).toFixed(1);
  t += speed;
  easedT = easeSelected(t);
  drawMidPoints();
  drawAndConnectInitialPoints();
  if (t >= 1) stp();
  else window.requestAnimationFrame(advance);
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
  save.set();
}

var mouseIsDown = false;
var dragging = -1;
onmousedown = function () {
  mouseIsDown = true;
};
ontouchstart = function () {
  mouseIsDown = true;
  console.log(mouseIsDown);
};

onmouseup = function () {
  mouseIsDown = false;
  dragging = -1;
};
onmousemove = function (e) {
  pointHandler(e);
};
ontouchmove = function (e) {
  pointHandler(e.touches[0]);
};
function pointHandler(windowEvent) {
  if (mouseIsDown == true) {
    console.log(mouseIsDown);
    var x = windowEvent.clientX;
    var y = windowEvent.clientY;
    for (var i = 0; i < points.data.length; i++) {
      if (
        (((x >= points.data[i][0] && x <= points.data[i][0] + 30) ||
          (x <= points.data[i][0] && x >= points.data[i][0] - 30)) &&
          ((y >= points.data[i][1] && y <= points.data[i][1] + 30) ||
            (y <= points.data[i][1] && y >= points.data[i][1] - 30))) ||
        dragging == i
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
          drawAndConnectInitialPoints()

          save.set();

          break;
        }
      }
    }
  }
}
function drawAndConnectInitialPoints() {
  for (var i = 0; i < points.data.length - 1; i++) {
    line(
      points.data[i][0],
      points.data[i][1],
      points.data[i + 1][0],
      points.data[i + 1][1]
    );
  }
  for (var i = 0; i < points.data.length; i++) {
    point(points.data[i][0], points.data[i][1], 10, colors[i]); // Anchor dots
  }
}

function drawMidPoints() {
  for (let i = 0; i < iteration; i++) {
      for (let j = 0; j < iteration-i; j++) {
          //I IS THE CURRENT ITERATION OF DRAWING MIDPOINTS. 0 IS FIRST
          //ITERATION MINUS I IS THE AMOUNT OF MIDPOINTS TO DRAW PER ITERATION
          //J IS THE CURRENT MIDPOINT TO DRAW IN THE ITERATION OF DRAWING MIDPOINTS WHICH IS I
          
          
          
          
          
          point(
              
          )
      }
  }
}

document.getElementById("easeOption").oninput = function () {
  easeSelected = window[document.getElementById("easeOption").value];
};