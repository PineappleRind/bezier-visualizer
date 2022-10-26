/**************
 * Bezier Visualizer
 * License: MIT
 * Oct 2021 - present
 * PineappleRind — pineapplerind.xyz
 *************/

void (function () {
  // i'm aware this code may not be the *best*
  // but it works & it's pretty readable

  // jquery-like shorthand
  const $ = document.querySelector.bind(document);

  // Lerp Function
  const lerp = (start, end, amt) =>
    Math.round(((1 - amt) * start + amt * end) * 100) / 100;

  // Bitfield object
  var bits = {
    lines: 0b00001,
    midpoints: 0b00010,
    trail: 0b00100,
    controlpoints: 0b01000,
    finalmidpoint: 0b10000,
    total: () => {
      let sum = 0;
      for (let i in bits) {
        if (bits[i] && typeof bits[i] === "number") sum += bits[i];
      }
      return sum;
    },
    compare: (a) => (saveData.settings.show & a) === a,
  };
  // save data template object
  var saveData = {
    data: [
      [331, 351], [38, 351], [331, 14], [38, 14],
    ],
    presets: [
      {
        name: "Default",
        data: [
          [30, 250], [250, 250], [30, 30], [250, 30],
        ],
        show: null,
      },
      {
        name: "Bow",
        data: [
          [143, 323], [482, 25], [54, 21], [113, 373], [231, 298], [482, 25], [54, 21], [279, 300], [371, 381], [483, 25], [54, 20], [357, 324],
        ],
        show: null,
      },
      {
        name: "Cursive f",
        data: [
          [193, 313], [513, 246], [42, 42], [410, 6], [120, 586], [567, 521], [53, 339], [332, 283],
        ],
        show: null,
      },
      {
        name: "Music note",
        data: [
          [280, 240], [119, 241], [340, 40], [140, 40], [140, 500], [400, 500], [40, 340], [210, 340],
        ],
      },
      {
        name: "Warp: infinity",
        data: [
          [683, 396], [592, 368], [737, 382], [799, 228], [764, 49], [639, 8], [456, 144], [260, 331], [97, 398], [9, 282], [16, 91], [118, 0], [288, 93], [486, 284], [618, 384], [775, 330], [796, 142], [719, 8], [565, 50], [370, 230], [158, 393], [48, 367], [0, 198], [50, 31], [185, 19], [373, 174], [568, 353], [722, 391], [796, 254], [774, 67], [660, 2], [483, 119], [285, 310], [115, 400], [15, 306], [10, 114], [100, 2], [263, 71], [460, 259], [642, 393], [765, 349], [799, 168], [735, 17], [589, 34], [396, 204], [205, 370], [62, 380], [1, 225], [38, 46], [163, 9], ,
        ],
        show: bits.midpoints,
      },
      {
        name: "Warp: circle",
        data: [
          [300, 600], [552, 462], [573, 175], [342, 3], [73, 104], [12, 385], [216, 588], [495, 528], [597, 256], [424, 27], [137, 48], [0, 301], [139, 553], [426, 572], [597, 341], [495, 72], [214, 13], [12, 217], [75, 498], [345, 597], [574, 422], [551, 136], [297, 0], [46, 140], [28, 427], [260, 597], [529, 494], [587, 212], [381, 11], [101, 76], [4, 346], [179, 574], [465, 550], [600, 296], [459, 45], [172, 29], [2, 262], [107, 530], [389, 587], [589, 380], [524, 100], [252, 4], [25, 180], [50, 467], [305, 600], [555, 458], [571, 170], [337, 2], [70, 108], [14, 390], [221, 589], [501, 523], [596, 251], [419, 25], [132, 51], [0, 307], [144, 556], [431, 570], [598, 336], [491, 69], [209, 14], [10, 223], [78, 502], [350, 596], [576, 418], [548, 131], [292, 0], [43, 145], [31, 432], [266, 598], [532, 490], [585, 207], [376, 10], [97, 79], [4, 352], [184, 577], [470, 547], [600, 291], [454, 43], [167, 31], [2, 267], [111, 533], [394, 585], [591, 375], [520, 96], [247, 5], [23, 185], [53, 471], [311, 600], [558, 453], [568, 166], [332, 2], [66, 112], [16, 395], [226, 591], [505, 519], [595, 246], [414, 22], [128, 54], [0, 312],
        ],
        show: bits.midpoints,
      },
    ],
    settings: {
      speed: 0.003,
      ease: "easeInOutQuad",
      // show everything
      show: bits.total(),
      colorAlgorithm: "goldenAngle",
      noCookies: undefined,
    },
  };
  // Keybinds
  let keybinds = {
    " ": () => {
      playing = !playing;
      if (t >= 0.999) replay();
    },
    Enter: () => {
      $("#controls").classList.toggle("hidden");
      $("#quickActions").classList.toggle("hidden");
    },
  };
  for (const keybind in keybinds) {
    // for each keybind
    document.documentElement.addEventListener("keyup", function (e) {
      // watch when it's triggered
      if (e.key === keybind) keybinds[keybind](e);
    });
  }
  // computed midpoints array for later
  let computed = [];

  var save = {
    get data() {
      return JSON.parse(localStorage.getItem("bezierSaveData"));
    },
    set: function () {
      // don't save cookies if the user doesn't want it
      if (saveData.noCookies) return void localStorage.clear();
      showSaveData();
      return localStorage.setItem("bezierSaveData", JSON.stringify(saveData));
    },
  };

  if (!save.data) save.set();
  else saveData = save.data;

  // Onclick handlers for the cookie banner
  const removeBanner = (n) => {
    $(".banner").classList.add("form-hidden");
    setTimeout(function () {
      $(".banner").remove();
    }, 300);
    saveData.noCookies = n;
    save.set();
  };
  $("#bannerClose").onclick = () => void removeBanner(false);
  $("#bannerDontStore").onclick = () => void removeBanner(true);

  // close it if the user already consented to cookies
  if (saveData.noCookies === false) removeBanner(false);

  //color algorithms
  let colorAlgorithms = {
    goldenAngle: (number) => `hsl(${number * 137.50776405},100%,50%)`,
    rainbow: (number) => `hsl(${number * 20},100%,50%)`,
    grayscale: (number) =>
      `hsl(0,0%,${(number / saveData.data.length) * 100}%)`,
  };

  // ease functions
  var eases = {
    easeInOutQuad: (x) =>
      x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
    easeInOutExpo: (x) =>
      x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5
        ? Math.pow(2, 20 * x - 10) / 2
        : (2 - Math.pow(2, -20 * x + 10)) / 2,
    easeInOutQuart: (x) =>
      x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2,
    bounce: (x) => {
      const n1 = 7.5625,
        d1 = 2.75;
      return x < 1 / d1
        ? n1 * x * x
        : x < 2 / d1
        ? n1 * (x -= 1.5 / d1) * x + 0.75
        : x < 2.5 / d1
        ? n1 * (x -= 2.25 / d1) * x + 0.9375
        : n1 * (x -= 2.625 / d1) * x + 0.984375;
    },
    linear: (x) => x,
  };

  // list of colors for points
  var colors = [];
  saveData.data.forEach(function (val, ind) {
    // generate a color for each point by its index
    colors.push(colorAlgorithms[saveData.settings.colorAlgorithm](ind));
  });

  let controls = {
    _playing: true,
    animationFrame: null,
    set playing(newv) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame =
        window[`${newv ? "request" : "cancel"}AnimationFrame`](advance);

      if (t <= 0.01) trail.clear();

      $("#playBtn").innerHTML = $("#quickPlay").innerHTML = newv
        ? "Stop"
        : "Play";

      // store it
      this._playing = newv;
    },
    get playing() {
      return this._playing;
    },
  };

  // number of iterations for the algorithm until it finds the final point
  let toIterate = saveData.data.length - 1,
    colorIteration = 1,
    t = 0,
    prev = [];

  // toasts!
  function toast(msg, theme) {
    // create
    let toast = document.createElement("DIV");
    // style
    toast.classList.add("toast", theme, "showing");
    toast.innerHTML = msg;
    setTimeout(() => {
      toast.classList.remove("showing");
      setTimeout(() => {
        toast.remove();
      }, 500);
    }, 3000);
    document.body.appendChild(toast);
  }

  // canvas manager
  var canvas = {
    element: $("#canvas"),
    context: $("#canvas").getContext("2d"),
    clear: function () {
      canvas.context.clearRect(
        0,
        0,
        canvas.element.width,
        canvas.element.height
      );
    },
  };
  // trail manager
  var trail = {
    element: $("#canvas2"),
    context: $("#canvas2").getContext("2d"),
    clear: function () {
      trail.context.clearRect(0, 0, trail.element.width, trail.element.height);
    },
  };

  function addPoint(x, y) {
    colorIteration++;
    colors.push(
      colorAlgorithms[saveData.settings.colorAlgorithm](colorIteration)
    );
    (x = 0 || x), (y = 0 || y);
    saveData.data.push([x, y]);
    toIterate = saveData.data.length - 1;
    initialPoints();
    save.set();
  }

  // this is the algorithm itself
  // this stumped me for a week 😅
  function compute(easedT) {
    toIterate = saveData.data.length - 1;
    // array filled with arrays with length of toIterate
    computed = Array.from(
      {
        length: toIterate,
      },
      () => []
    );

    // for each iteration of midpoints:
    for (let i = 0; i < toIterate; i++) {
      // for each point in the iteration of midpoints:
      for (let point = 0; point < toIterate - i; point++) {
        // if it's the first iteration, compute based on the control points.
        // otherwise base it on the previous iteration's midpoints
        let lerpOn = i === 0 ? saveData.data : computed[i - 1];
        computed[i].push([
          lerp(lerpOn[point][0], lerpOn[point + 1][0], easedT),
          lerp(lerpOn[point][1], lerpOn[point + 1][1], easedT),
        ]);
      }
    }
  }

  function resizeHandler() {
    canvas.element.setAttribute("height", window.innerHeight);
    canvas.element.setAttribute("width", window.innerWidth);
    trail.element.setAttribute("height", window.innerHeight);
    trail.element.setAttribute("width", window.innerWidth);
  }

  onresize = () => {
    resizeHandler();
    initialPoints();
  };
  // shorthand draw functions for canvas
  const draw = {
    point(x, y, rad, color) {
      canvas.context.beginPath();
      canvas.context.arc(x, y, rad, 0, 2 * Math.PI, true);
      canvas.context.closePath();
      if (!color) canvas.context.fillStyle = "#ffffff";
      else canvas.context.fillStyle = color;
      canvas.context.fill();
    },
    line(startx, starty, finishx, finishy) {
      canvas.context.beginPath();
      canvas.context.strokeStyle = "#ffffff";
      canvas.context.moveTo(startx, starty);
      canvas.context.lineTo(finishx, finishy);
      canvas.context.stroke(); // Bottom side line
    },
    trail(x, y, prevX, prevY) {
      if (!bits.compare(bits.trail)) return;
      if ((!prevX && !prevY) || t < 0.03) (prevX = x), (prevY = y);
      const { context } = trail;
      const dist = (point1, point2) =>
        Math.sqrt(
          Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
        );
      let distance = dist({ x: prevX, y: prevY }, { x, y });
      if (distance > Math.PI * 2) {
        // If the points are too far from each other..
        for (let i = 0; i < distance; i++) {
          context.beginPath(); // Fill them in!
          context.fillStyle = "#ffffff";
          context.arc(
            lerp(prevX, x, i / distance),
            lerp(prevY, y, i / distance),
            10,
            0,
            Math.PI * 2,
            true
          );
          context.fill();
        }
      }

      context.beginPath();
      context.fillStyle = "#ffffff";
      context.arc(x, y, 10, 0, Math.PI * 2, true);
      context.fill();
    },
  };

  /*************
   * Button Handlers
   ***************/

  // Onclick
  $("#minimize").onclick = (e) => {
    $("#quickActions").classList.toggle("hidden");
    $("#speedometer").classList.toggle("hidden");
    $("#controls").classList.toggle("hidden");
  };

  $("#playBtn").onclick = $("#quickPlay").onclick = () => controls.playing = !controls.playing;
  $("#replayBtn").onclick = replay;
  $("#quickReplay").onclick = replay;
  $("#resetCurveBtn").onclick = resetCurve;

  // Oninput
  $("#animationSpeed").oninput = (e) => {
    $("#animationSpeedLabel").innerHTML = e.target.value;
    saveData.settings.speed = +e.target.value;
  };
  $("#tValue").oninput = (e) => {
    $("#tValueLabel").innerHTML = e.target.value;
    t = +e.target.value;
    advance();
    controls.playing = false;
  };

  function replay() {
    t = 0;
    trail.clear();
    controls.playing = false;
    controls.playing = true;
    initialPoints();
  }

  // Next frame function
  function advance() {
    canvas.clear();
    if (!saveData.settings.ease) saveData.settings.ease = "quadraticEaseInOut";
    let easedT = eases[saveData.settings.ease](t);

    // Update T value
    $("#speedometer").innerHTML =
      $("#tValue").value =
      $("#tValueLabel").innerHTML =
        easedT.toFixed(3);

    t += saveData.settings.speed;

    // Compute
    compute(easedT);
    let final = drawMidPoints();

    // Draw
    draw.trail(final[0], final[1], prev[0], prev[1]);
    initialPoints();
    prev = final;

    // Next frame
    // stop if it shouldn't be playing
    if (easedT < 0 || t >= 1 || controls.playing === false)
      controls.playing = false;
    // continue if it should
    else controls.playing = true;
  }

  function resetCurve() {
    saveData.data = [
      [331, 351],
      [38, 351],
      [331, 14],
      [38, 14],
    ];
    save.set();
  }
  var mouseIsDown = false;
  var dragging = -1;

  onmousedown = function () {
    mouseIsDown = true;
  };

  onmouseup = function () {
    mouseIsDown = false;
    dragging = -1;
  };
  onmousemove = pointHandler;
  if (window.ontouchmove && window.ontouchstart) {
    ontouchstart = function () {
      mouseIsDown = true;
    };
    ontouchmove = function (e) {
      pointHandler(e.touches[0]);
    };
  }

  // handle dragging of points
  function pointHandler(windowEvent) {
    // if mouse is down
    if (mouseIsDown === true) {
      var x = windowEvent.clientX;
      var y = windowEvent.clientY;
      // already dragging a point? don't stop
      // until user lifts mouse
      if (dragging != -1) {
        updatePoint(dragging);
        return;
      }
      // for each point
      for (var i = 0; i < saveData.data.length; i++) {
        // if the point intersects with the cursor
        if (intersectingPoints(x, y, i) === true) {
          // store the point
          if (dragging === -1) dragging = i;
          // don't let it go out of bounds
          if (x < 0) break;
          if (y < 0) break;
          if (x > window.innerWidth) break;
          if (y > window.innerHeight) break;
          // visually update the point
          updatePoint(i);
          break;
        }
      }
    }

    // update a singular point
    function updatePoint(pointIndex) {
      // set the data
      saveData.data[pointIndex][0] = x;
      saveData.data[pointIndex][1] = y;
      // redraw the canvas
      canvas.clear();
      initialPoints();
      save.set();
    }
  }

  // takes in a mouse event, determines what point the user is
  // trying to remove, and removes it
  function removePointHandler(evt) {
    var x = evt.clientX;
    var y = evt.clientY;
    var notFound = 0;
    for (var i = 0; i < saveData.data.length; i++) {
      // trying to remove point if there are 2 points already
      if (intersectingPoints(x, y, i) === true && saveData.data.length <= 2) {
        toast("You can't have less than 2 points", "info");
        break;
      }

      if (intersectingPoints(x, y, i) === true && saveData.data.length > 2) {
        dragging = i;
        saveData.data = arrRemove(saveData.data, saveData.data[i]);
        canvas.clear();
        save.set();
        toIterate = saveData.data.length - 1;
        initialPoints();
        dragging = -1;
      } else {
        // not the point?
        notFound++;
        if (
          i === saveData.data.length - 1 &&
          notFound === saveData.data.length - 1
        )
          break;
        // if user is not intersecting with points
        // then add a point where user clicked
        else if (
          i === saveData.data.length - 1 &&
          notFound === saveData.data.length
        ) {
          addPoint(x, y);
          break;
        }
      }
    }
  }

  // array remove since javascript doesn't have a native one
  function arrRemove(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  // bind function to event
  canvas.element.ondblclick = removePointHandler;

  // determine if mouse pos [x,y] intersect with point index i
  function intersectingPoints(x, y, i) {
    const { data: d } = saveData;
    return (
      (((x >= d[i][0] && x <= d[i][0] + 10) ||
        (x <= d[i][0] && x >= d[i][0] - 10)) &&
        ((y >= d[i][1] && y <= d[i][1] + 10) ||
          (y <= d[i][1] && y >= d[i][1] - 10))) ||
      dragging === i
    );
  }

  // draw the control points & lines
  function initialPoints() {
    const { data: d } = saveData;
    for (var i = 0; i < d.length; i++) {
      // if the user is showing lines
      // draw a line between it and the next one
      if (bits.compare(bits.lines) && i < d.length - 1)
        draw.line(d[i][0], d[i][1], d[i + 1][0], d[i + 1][1]);

      // if the user is showing control points
      // draw a control point
      if (bits.compare(bits.controlpoints))
        draw.point(d[i][0], d[i][1], 10, colors[i]); // Anchor dots
    }
  }

  // draw the midpoints computed by compute()
  function drawMidPoints() {
    // for each iteration of midpoints
    for (let i = 0; i < computed.length; i++) {
      // for each midpoint in that iteration
      for (let j = 0; j < computed[i].length; j++) {
        // default dot radius = 3px
        let radius = 3;
        // final midpoint radius = 10px
        if (i === computed.length - 1 && bits.compare(bits.finalmidpoint))
          radius = 10;

        // user is showing midpoints? draw the point
        if (
          bits.compare(bits.midpoints) ||
          (radius === 10 && bits.compare(bits.finalmidpoint))
        ) {
          draw.point(computed[i][j][0], computed[i][j][1], radius);
        }

        // user is showing lines? draw lines in between midpoints
        if (bits.compare(bits.lines) && j > 0)
          draw.line(
            computed[i][j][0],
            computed[i][j][1],
            computed[i][j - 1][0],
            computed[i][j - 1][1]
          );

        // return if done
        if (i === computed.length - 1)
          return [computed[i][j][0], computed[i][j][1]];
      }
    }
  }

  // update ease option when user changes
  $("#easeOption").oninput = function () {
    saveData.settings.ease = $("#easeOption").value;
    save.set();
  };
  // general input handler
  oninput = (e) => {
    let target = e.target;
    if (target.tagName === "TEXTAREA") return; // don't care if it's a textarea

    // put the colorOption listener inside this one
    // since it doesn't work alone for some reason.
    if (target.id === "colorOption") {
      // set colorAlgorithm
      saveData.settings.colorAlgorithm = e.target.value;
      colors = [];
      // compute colors for each point based on colorAlgorithm
      saveData.data.forEach(function (val, ind) {
        colors.push(colorAlgorithms[saveData.settings.colorAlgorithm](ind));
      });
      save.set();
    }

    // this just assumes the target is a showCheckbox
    let toChange = target.getAttribute("id");
    if (bits[toChange]) {
      saveData.settings.show ^= bits[toChange];
      save.set();
    }
  };

  // update the checkbox based on the show bitfield
  function updateCheckboxes() {
    let cs = document.querySelectorAll(".showCheckbox");
    // for each checkbox
    for (let i = 0; i < cs.length; i++) {
      let cur = cs[i];
      // uncheck it
      cur.checked = false;
      if (bits.compare(bits[cur.getAttribute("id")])) {
        // re-check it if the show bitfield says so :)
        cur.checked = true;
      }
    }
  }

  // dropdown for colorAlgorithms (it's dynamic™!)
  function getColorSelectHTML() {
    let res = `<select id="colorOption">`;
    for (const c in colorAlgorithms) {
      selected = "";
      if (saveData.settings.colorAlgorithm === c) selected = "selected";
      res += `<option value="${c}" name="${c}" ${selected}>${c}</option>`;
    }
    res += `</select>`;
    return res;
  }

  $("#colorOption").parentElement.innerHTML = getColorSelectHTML();
  /**********************
   * Saving Features
   * Development from:
   * Nov 16 - Nov 18
   **********************/
  function showSaveData() {
    let ta = $("#saveDataTextarea");
    ta.value = JSON.stringify(saveData);
  }

  function loadSaveData() {
    // 🤨
    let element = $("#saveDataTextarea");
    try {
      var toSave = JSON.parse(element.value);
    } catch (error) {
      toast(
        `Invalid data structure<br><small style="font-weight:200"> ${error}</small>`,
        "error"
      );
      return;
    }

    if (!toSave.data) return toast("Invalid save code: no data", "error");

    for (let i = 0; i < toSave.data.length; i++) {
      if (toSave.data[i].length != 2)
        // since coordinates must be of length 2 [x, y]
        return toast(
          `Invalid save code <br><small style="font-weight:200">Data point ${
            i + 1
          } has invalid coordinates</small>`,
          "error"
        );
    }
    saveData = toSave;
    save.set();
    toast("Successfully loaded save code", "success");
  }
  $("#loadSaveDataBtn").onclick = (e) => void loadSaveData();

  /*********************
   * Quick Actions!
   ********************/

  $("#quickPlay").onclick = () => {
    if (t >= 0.999) {
      replay();
    } else controls.playing = !controls.playing;
  };

  /*******************
   * Presets
   * Initially coded around Nov 2021
   * Adapted for life inside an IIFE on August 19, 2022
   *******************/
  var psc = $("#presetSelectChoice");
  psc.innerHTML = presetSelectHTML();
  function presetSelectHTML() {
    let res = ``;
    for (const [i, preset] of saveData.presets.entries()) {
      res += `<option value="${i}"${
        preset.data === saveData.data ? " selected" : ""
      }>${preset.name}</option>`;
    }
    return res;
  }
  psc.oninput = () => {
    loadPreset(+psc.value);
    save.set();
  };
  function loadPreset(i) {
    let newPreset = saveData.presets[i];
    saveData.data = newPreset.data;
    saveData.settings.show = newPreset.show || 0b11111;

    replay(), save.set(), updateCheckboxes();
  }

  /*********
   * Init
   ********/
  updateCheckboxes();
  showSaveData();
  resizeHandler();
  // Update animation speed value
  $("#animationSpeed").value = $("#animationSpeedLabel").innerHTML = saveData.settings.speed.toFixed(4);

  // Start the animation
  controls.playing = true;
})();
