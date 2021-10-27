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
var colors = ["red", "blue", "lime", "yellow", "purple", "orange", "green", "pink", "rebeccapurple", "yellowgreen", "dodgerblue", "magenta", "indianred", "darkblue", "darkkhaki", "darksalmon", "darkslategray", "orangered", "seagreen"];
var points = {
  data: [
      [331, 351],
      [38, 351],
      [331, 14],
      [38, 14],
  ],

  computed: [],
};



var save = {
  get: function () {
    return JSON.parse(localStorage.getItem("bezierSaveData"));
  },
  set: function () {
    return localStorage.setItem("bezierSaveData", JSON.stringify(points));
  },
};

//if (localStorage.getItem("bezierBannerState"))
//document.querySelector(".banner").remove();

if (!save.get()) {
  save.set();
} else {
  points = save.get();
}
let iteration = points.data.length - 1;
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
  easeSelected = window.quadraticEaseInOut;
function addPoint() {
  points.data.push([0, 0])
  iteration = points.data.length - 1;
  drawAndConnectInitialPoints()
}
function com(easedT) {
  points.computed = []
  for (let o = 0; o < iteration; o++) points.computed.push([])
  for (let i = 0; i < iteration; i++) {
    for (let j = 0; j < iteration - i; j++) {
      if (i === 0) {
        points.computed[0].push(
          [
            lerp(
              points.data[j][0],
              points.data[j + 1][0],
              easedT
            ),
            lerp(
              points.data[j][1],
              points.data[j + 1][1],
              easedT
            ),
          ]
        );
      } else if (i != 0 && j < iteration - i) {
        points.computed[i].push(
          [
            lerp(
              points.computed[i - 1][j][0],
              points.computed[i - 1][j + 1][0],
              easedT
            ), lerp(
              points.computed[i - 1][j][1],
              points.computed[i - 1][j + 1][1],
              easedT
            )
          ]
        )
      }
    }
  }
}

canv.setAttribute('height', window.innerHeight)
canv.setAttribute('width', window.innerWidth)
canv2.setAttribute('height', window.innerHeight)
canv2.setAttribute('width', window.innerWidth)
onresize = () => {
  canv.setAttribute('height', window.innerHeight)
  canv.setAttribute('width', window.innerWidth)
  canv2.setAttribute('height', window.innerHeight)
  canv2.setAttribute('width', window.innerWidth);
  drawAndConnectInitialPoints()
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

function evaluatePlaying() {
  if (playing == true) window.requestAnimationFrame(advance), (document.getElementById("playBtn").innerHTML = "Stop");
  else window.cancelAnimationFrame(advance), (document.getElementById("playBtn").innerHTML = "Play")
}
window.requestAnimationFrame(advance)
function replay() {
  window.cancelAnimationFrame(advance)
  t = 0;
  clearCanvas(
  )
  clearTrail()
  window.requestAnimationFrame(advance), (document.getElementById("playBtn").innerHTML = "Stop");
  playing = true;
}
function advance() {
  clearCanvas();
  document.getElementById("speedometer").innerHTML =
    "t=" + easeSelected(t).toFixed(3);
  t += speed;
  easedT = easeSelected(t);
  com(easedT);
  let final = drawMidPoints();
  drawTrail(final[0], final[1])
  drawAndConnectInitialPoints();
  if (t >= 1 || playing == false) window.cancelAnimationFrame(advance);
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
      [331, 351],
      [38, 351],
      [331, 14],
      [38, 14],
    ], computed:  []
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
    var x = windowEvent.clientX;
    var y = windowEvent.clientY;
    for (var i = 0; i < points.data.length; i++) {
      if (
        intersectingPoints(x,y,i) == true
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
function removePointHandler(evt) {
    var x = evt.clientX;
    var y = evt.clientY;
    for (var i = 0; i < points.data.length; i++) {
      if (intersectingPoints(x,y,i) && points.data.length <= 2) {
        alert('You can\'t have less than 2 points!')
        break;
      }
      if (
        intersectingPoints(x,y,i) == true
        &&
        points.data.length > 2
      ) {
        dragging = i;
        if (dragging == i) {
          points.data = arrRemove(points.data,points.data[i])
          clearCanvas();
          
          save.set();
          iteration = points.data.length - 1
          drawAndConnectInitialPoints()
          
          break;
        }
      } 
      
    }
}
function arrRemove(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

ondblclick = e => {

  removePointHandler(e)

}
function intersectingPoints(x, y, i) {
  return ((((x >= points.data[i][0] && x <= points.data[i][0] + 20) ||
    (x <= points.data[i][0] && x >= points.data[i][0] - 20)) &&
    ((y >= points.data[i][1] && y <= points.data[i][1] + 20) ||
      (y <= points.data[i][1] && y >= points.data[i][1] - 20))) ||
    dragging == i)
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
  for (let i = 0; i < points.computed.length; i++) {
    for (let j = 0; j < points.computed[i].length; j++) {
      let radius
      i == points.computed.length - 1 ? radius = 10 : radius = 3
      point(
        points.computed[i][j][0],
        points.computed[i][j][1],
        radius
      )
      if (j > 0) line(
        points.computed[i][j][0], points.computed[i][j][1],
        points.computed[i][j - 1][0], points.computed[i][j - 1][1]
      )
      if (i == points.computed.length - 1) return [points.computed[i][j][0],
      points.computed[i][j][1]]
    }
  }
}
function drawTrail(x, y) {
  ctx2.beginPath();
  ctx2.fillStyle = "#ffffff";
  ctx2.arc(x, y, 10, 0, 2 * Math.PI, true);
  ctx2.closePath();
  ctx2.fill();
}

document.getElementById("easeOption").oninput = function () {
  easeSelected = window[document.getElementById("easeOption").value];
};