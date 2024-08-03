/**************
 * Bezier Visualizer
 * License: MIT
 * Oct 2021 - present
 * PineappleRind — pineapplerind.xyz
 *************/
import Bezier from "./Bezier";

  // i'm aware this code may not be the *best*
  // but it works & it's pretty readable

  // set version
  window.__version__ = "1.1.1";

;
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
  saveData = save.data;

  // If data has expired
  if (saveData?.expiry < Date.now() || !saveData.expiry) {
    // Remove the data
    localStorage.removeItem("bezierSaveData");
    // Clear the data variable
    saveData = {};
    // Repopulate data by reloading
    window.location.reload();
  }
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

  function addPoint(x, y) {
    colorIteration++;
    colors.push(
      colorAlgorithms[saveData.settings.colorAlgorithm](colorIteration)
    );
    (x = 0 || x), (y = 0 || y);
    saveData.data.push([x, y]);
    toIterate = saveData.data.length - 1;
    Renderer.render();
    save.set();
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

  /*************
   * Button Handlers
   ***************/

  // Onclick
  $("#minimize").onclick = (e) => {
    $("#quickActions").classList.toggle("hidden");
    $("#speedometer").classList.toggle("hidden");
    $("#controls").classList.toggle("hidden");
  };

  $("#playBtn").onclick = $("#quickPlay").onclick = () =>
    (controls.playing = !controls.playing);
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
    let showTarget = target.getAttribute("id");
    if (show[showTarget]) {
      saveData.settings.show ^= show[showTarget];
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
      if (show.isShowing(show[cur.getAttribute("id")])) {
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
  $("#animationSpeed").value = $("#animationSpeedLabel").innerHTML =
    saveData.settings.speed.toFixed(4);

  // Start the animation
  controls.playing = true;
