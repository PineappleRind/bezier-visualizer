"use strict";

(function () {
  function $(id) {
    return document.getElementById(id);
  }

  function lerp(start, end, amt) {
    return Math.round(((1 - amt) * start + amt * end) * 100) / 100;
  }

  var saveData = {
    data: [[331, 351], [38, 351], [331, 14], [38, 14]],
    presets: [{
      name: "Default",
      data: [[30, 250], [250, 250], [30, 30], [250, 30]],
      show: null
    }, {
      name: "Bow",
      data: [[143, 323], [482, 25], [54, 21], [113, 373], [231, 298], [482, 25], [54, 21], [279, 300], [371, 381], [483, 25], [54, 20], [357, 324]],
      show: null
    }, {
      name: "Cursive f",
      data: [[193, 313], [513, 246], [42, 42], [410, 6], [120, 586], [567, 521], [53, 339], [332, 283]],
      show: null
    }, {
      name: "Infinity Warp",
      data: [[683, 396], [592, 368], [737, 382], [799, 228], [764, 49], [639, 8], [456, 144], [260, 331], [97, 398], [9, 282], [16, 91], [118, 0], [288, 93], [486, 284], [618, 384], [775, 330], [796, 142], [719, 8], [565, 50], [370, 230], [158, 393], [48, 367], [0, 198], [50, 31], [185, 19], [373, 174], [568, 353], [722, 391], [796, 254], [774, 67], [660, 2], [483, 119], [285, 310], [115, 400], [15, 306], [10, 114], [100, 2], [263, 71], [460, 259], [642, 393], [765, 349], [799, 168], [735, 17], [589, 34], [396, 204], [205, 370], [62, 380], [1, 225], [38, 46], [163, 9]],
      show: {
        "lines": false,
        "midpoints": true,
        "trail": false,
        "controlpoints": false,
        "finalmidpoint": false
      }
    }, {
      name: "Circle Warp",
      data: [[300, 600], [552, 462], [573, 175], [342, 3], [73, 104], [12, 385], [216, 588], [495, 528], [597, 256], [424, 27], [137, 48], [0, 301], [139, 553], [426, 572], [597, 341], [495, 72], [214, 13], [12, 217], [75, 498], [345, 597], [574, 422], [551, 136], [297, 0], [46, 140], [28, 427], [260, 597], [529, 494], [587, 212], [381, 11], [101, 76], [4, 346], [179, 574], [465, 550], [600, 296], [459, 45], [172, 29], [2, 262], [107, 530], [389, 587], [589, 380], [524, 100], [252, 4], [25, 180], [50, 467], [305, 600], [555, 458], [571, 170], [337, 2], [70, 108], [14, 390], [221, 589], [501, 523], [596, 251], [419, 25], [132, 51], [0, 307], [144, 556], [431, 570], [598, 336], [491, 69], [209, 14], [10, 223], [78, 502], [350, 596], [576, 418], [548, 131], [292, 0], [43, 145], [31, 432], [266, 598], [532, 490], [585, 207], [376, 10], [97, 79], [4, 352], [184, 577], [470, 547], [600, 291], [454, 43], [167, 31], [2, 267], [111, 533], [394, 585], [591, 375], [520, 96], [247, 5], [23, 185], [53, 471], [311, 600], [558, 453], [568, 166], [332, 2], [66, 112], [16, 395], [226, 591], [505, 519], [595, 246], [414, 22], [128, 54], [0, 312]],
      show: {
        "lines": false,
        "midpoints": true,
        "trail": false,
        "controlpoints": false,
        "finalmidpoint": false
      }
    }],
    show: {
      "lines": false,
      "midpoints": true,
      "trail": false,
      "controlpoints": false,
      "finalmidpoint": false
    },
    settings: {
      speed: 0.002,
      ease: 'easeInOutQuad',
      show: {
        lines: true,
        midpoints: true,
        trail: true,
        controlpoints: true,
        finalmidpoint: true
      },
      colorAlgorithm: 'goldenAngle'
    }
  };
  var keybinds = {
    ' ': function _() {
      playing = !playing;
      if (t <= 0.01) trail.clear();else if (t >= 0.99) replay();
      evaluatePlaying();
    },
    'Enter': function Enter() {
      $('controls').classList.toggle('hidden');
      $('quickActions').classList.toggle('hidden');
    }
  };

  var _loop = function _loop(keybind) {
    document.documentElement.addEventListener('keyup', function (e) {
      if (e.key === keybind) keybinds[keybind](e);
    });
  };

  for (var keybind in keybinds) {
    _loop(keybind);
  }

  var computed = [];
  var save = {
    getData: function getData() {
      return JSON.parse(localStorage.getItem("bezierSaveData"));
    },
    set: function set() {
      showSaveData();
      return localStorage.setItem("bezierSaveData", JSON.stringify(saveData));
    }
  };
  if (!save.getData()) save.set();else saveData = save.getData();
  var colorAlgorithms = {
    'goldenAngle': function goldenAngle(number) {
      return "hsl(".concat(number * 137.50776405, ",100%,50%)");
    },
    'rainbow': function rainbow(number) {
      return "hsl(".concat(number * 20, ",100%,50%)");
    },
    'grayscale': function grayscale(number) {
      return "hsl(0,0%,".concat(number / saveData.data.length * 100, "%)");
    }
  };
  var eases = {
    'easeInOutQuad': function easeInOutQuad(x) {
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    },
    'easeInOutExpo': function easeInOutExpo(x) {
      return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
    },
    'easeInOutQuart': function easeInOutQuart(x) {
      return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    },
    'bounce': function bounce(x) {
      var n1 = 7.5625,
          d1 = 2.75;
      return x < 1 / d1 ? n1 * x * x : x < 2 / d1 ? n1 * (x -= 1.5 / d1) * x + .75 : x < 2.5 / d1 ? n1 * (x -= 2.25 / d1) * x + .9375 : n1 * (x -= 2.625 / d1) * x + .984375;
    },
    'linear': function linear(x) {
      return x;
    }
  };
  var colors = [];
  saveData.data.forEach(function (val, ind) {
    colors.push(colorAlgorithms[saveData.settings.colorAlgorithm](ind));
  });

  function toast(msg, theme) {
    var toast = document.createElement('DIV');
    toast.classList.add('toast');
    toast.classList.add(theme);
    toast.innerHTML = msg;
    setTimeout(function () {
      toast.classList.add('showing');
      setTimeout(function () {
        toast.classList.remove('showing');
        setTimeout(function () {
          toast.remove();
        }, 500);
      }, 3000);
    });
    document.body.appendChild(toast);
  }

  var toIterate = saveData.data.length - 1;
  var playing = true;
  var canvas = {
    element: $("canvas"),
    context: $("canvas").getContext("2d"),
    clear: function clear() {
      canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height);
    }
  };
  var trail = {
    element: $("canvas2"),
    context: $("canvas2").getContext("2d"),
    clear: function clear() {
      trail.context.clearRect(0, 0, trail.element.width, trail.element.height);
    }
  };
  var t = 0,
      colorIteration = 1;

  function addPoint(x, y) {
    colorIteration++;
    colors.push(colorAlgorithms[settings.colorAlgorithm](colorIteration));
    x = 0 || x, y = 0 || y;
    saveData.data.push([x, y]);
    toIterate = data.length - 1;
    initialPoints();
    save.set();
  }

  function com(easedT) {
    toIterate = saveData.data.length - 1;
    computed = Array.from({
      length: toIterate
    }, function () {
      return [];
    });

    for (var i = 0; i < toIterate; i++) {
      // For each iteration of midpoints:            
      for (var _point = 0; _point < toIterate - i; _point++) {
        //For each point in the iteration of midpoints: 
        var lerpOn = i === 0 ? saveData.data : computed[i - 1]; // If it's the first iteration, lerp on the control points. Otherwise lerp on the previous iteration's midpoints

        computed[i].push([lerp(lerpOn[_point][0], lerpOn[_point + 1][0], easedT), lerp(lerpOn[_point][1], lerpOn[_point + 1][1], easedT)]);
      }
    }
  }

  function resizeHandler() {
    canvas.element.setAttribute('height', window.innerHeight);
    canvas.element.setAttribute('width', window.innerWidth);
    trail.element.setAttribute('height', window.innerHeight);
    trail.element.setAttribute('width', window.innerWidth);
  }

  resizeHandler();

  onresize = function onresize() {
    resizeHandler();
    initialPoints();
  };

  function point(x, y, rad, col) {
    canvas.context.beginPath();
    canvas.context.arc(x, y, rad, 0, 2 * Math.PI, true);
    canvas.context.closePath();
    if (!col) canvas.context.fillStyle = "#ffffff";else canvas.context.fillStyle = col;
    canvas.context.fill();
  }

  function line(startx, starty, finishx, finishy) {
    canvas.context.beginPath();
    canvas.context.strokeStyle = "#ffffff";
    canvas.context.moveTo(startx, starty);
    canvas.context.lineTo(finishx, finishy);
    canvas.context.stroke(); // Bottom side line
  }

  $('minimize').onclick = function (e) {
    e.target.parentElement.classList.toggle('hidden');
    e.target.parentElement.nextElementSibling.classList.toggle('hidden');
  };

  $('playBtn').onclick = function (e) {
    playing = !playing;
    if (t <= 0.01) trail.clear();
    evaluatePlaying();
  };

  $('replayBtn').onclick = replay;
  $('resetCurveBtn').onclick = resetCurve;
  $('quickReplay').onclick = replay;

  $('animationSpeed').oninput = function (e) {
    return saveData.settings.speed = e.target.value / 1000;
  };

  function evaluatePlaying() {
    if (playing === true) {
      window.requestAnimationFrame(advance);
      $('quickPlay').classList.add('playing');
    } else {
      window.cancelAnimationFrame(advance);
      $('quickPlay').classList.remove('playing');
    }

    $("playBtn").innerHTML = playing ? "Stop" : "Play";
    $('quickPlay').innerHTML = playing ? "Stop" : "Play";
  }

  evaluatePlaying();
  updateCheckboxes();

  function replay() {
    playing ? window.cancelAnimationFrame(advance) : window.requestAnimationFrame(advance);
    t = 0;
    canvas.clear();
    trail.clear();
    playing = true;
    initialPoints();
  }

  var prev = [];

  function advance() {
    canvas.clear();
    if (!saveData.settings.ease) saveData.settings.ease = 'quadraticEaseInOut';
    $("speedometer").innerHTML = "t=" + eases[saveData.settings.ease](t).toFixed(3);
    t += saveData.settings.speed;
    com(eases[saveData.settings.ease](t));

    var _final = drawMidPoints();

    drawTrail(_final[0], _final[1], prev[0], prev[1]);
    prev = _final;
    window.cancelAnimationFrame(advance);
    initialPoints();

    if (t >= 1 || playing === false) {
      playing = false;
      evaluatePlaying();
    } else window.requestAnimationFrame(advance);
  }

  function resetCurve() {
    saveData.data = [[331, 351], [38, 351], [331, 14], [38, 14]];
    save.set();
  }

  var mouseIsDown = false;
  var dragging = -1,
      draggingPoint = -1;

  onmousedown = function onmousedown() {
    mouseIsDown = true;
  };

  ontouchstart = function ontouchstart() {
    mouseIsDown = true;
  };

  onmouseup = function onmouseup() {
    mouseIsDown = false;
    dragging = -1;
    draggingPoint = -1;
  };

  onmousemove = function onmousemove(e) {
    pointHandler(e);
  };

  ontouchmove = function ontouchmove(e) {
    pointHandler(e.touches[0]);
  };

  function pointHandler(windowEvent) {
    if (mouseIsDown === true) {
      var x = windowEvent.clientX;
      var y = windowEvent.clientY;

      if (dragging != -1) {
        updatePoint(dragging);
        return;
      }

      for (var i = 0; i < saveData.data.length; i++) {
        if (intersectingPoints(x, y, i) === true) {
          if (dragging == -1) dragging = i;
          if (x < 0) break;
          if (y < 0) break;
          if (x > window.innerWidth) break;
          if (y > window.innerHeight) break;
          updatePoint(i);
          break;
        }
      }
    }

    function updatePoint(pointIndex) {
      saveData.data[pointIndex][0] = x;
      saveData.data[pointIndex][1] = y;
      canvas.clear();
      initialPoints();
      save.set();
    }
  }

  function removePointHandler(evt) {
    var x = evt.clientX;
    var y = evt.clientY;
    var iter = 0;

    for (var i = 0; i < saveData.data.length; i++) {
      if (intersectingPoints(x, y, i) === true && saveData.data.length <= 2) {
        toast('You can\'t have less than 2 points', 'info');
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
        break;
      } else {
        iter++;

        if (i == saveData.data.length - 1 && iter == saveData.data.length - 1) {
          break;
        } else if (i == saveData.data.length - 1 && iter == saveData.data.length) {
          addPoint(x, y);
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

  canvas.element.ondblclick = function (e) {
    removePointHandler(e);
  };

  function intersectingPoints(x, y, i) {
    var _saveData = saveData,
        data = _saveData.data;
    return (x >= data[i][0] && x <= data[i][0] + 10 || x <= data[i][0] && x >= data[i][0] - 10) && (y >= data[i][1] && y <= data[i][1] + 10 || y <= data[i][1] && y >= data[i][1] - 10) || dragging === i;
  }

  function initialPoints() {
    var _saveData2 = saveData,
        data = _saveData2.data,
        settings = _saveData2.settings;

    if (settings.show.lines == true) {
      for (var i = 0; i < data.length - 1; i++) {
        line(data[i][0], data[i][1], data[i + 1][0], data[i + 1][1]);
      }
    }

    for (var i = 0; i < data.length; i++) {
      if (settings.show.controlpoints === true) point(data[i][0], data[i][1], 10, colors[i]); // Anchor dots
    }
  }

  function drawMidPoints() {
    var show = saveData.settings.show;

    for (var i = 0; i < computed.length; i++) {
      for (var j = 0; j < computed[i].length; j++) {
        var radius = 3;
        if (i === computed.length - 1 && show.finalmidpoint === true) radius = 10;

        if (show.midpoints == true || radius == 10 && show.finalmidpoint == true) {
          point(computed[i][j][0], computed[i][j][1], radius);
        }

        if (show.lines == true && j > 0) line(computed[i][j][0], computed[i][j][1], computed[i][j - 1][0], computed[i][j - 1][1]);
        if (i === computed.length - 1) return [computed[i][j][0], computed[i][j][1]];
      }
    }
  }

  function drawTrail(x, y, prevX, prevY) {
    if (saveData.settings.show.trail == false) return;
    if (!prevX && !prevY || t < 0.03) prevX = x, prevY = y;
    var context = trail.context;

    var dist = function dist(point1, point2) {
      return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    };

    var distance = dist({
      x: prevX,
      y: prevY
    }, {
      x: x,
      y: y
    });

    if (distance > Math.PI * 2) {
      // If the points are too far from each other..
      for (var i = 0; i < distance; i++) {
        context.beginPath(); // Fill them in!

        context.fillStyle = '#ffffff';
        context.arc(lerp(prevX, x, i / distance), lerp(prevY, y, i / distance), 10, 0, Math.PI * 2, true);
        context.fill();
      }
    }

    context.beginPath();
    context.fillStyle = '#ffffff';
    context.arc(x, y, 10, 0, Math.PI * 2, true);
    context.fill();
  }

  $("easeOption").oninput = function () {
    saveData.settings.ease = $("easeOption").value;
    save.set();
  };

  $("colorOption").oninput = function () {
    saveData.settings.colorAlgorithm = $("colorOption").value;
    colors = [];
    saveData.data.forEach(function (val, ind) {
      colors.push(colorAlgorithms[saveData.settings.colorAlgorithm](ind));
    });
    save.set();
  };

  oninput = function oninput(e) {
    var target = e.target;
    if (target.tagName === 'TEXTAREA') return;
    var toChange = target.getAttribute('id');
    saveData.settings.show[toChange] = !saveData.settings.show[toChange];
    save.set();
  };

  function updateCheckboxes() {
    for (var i = 0; i < document.querySelectorAll('.showCheckbox').length; i++) {
      var cur = document.querySelectorAll('.showCheckbox')[i];
      var objKey = saveData.settings.show[Object.keys(saveData.settings.show)[i]];
      if (objKey === true) cur.checked = true;else cur.checked = false;
    }
  }

  function getColorSelectHTML() {
    var res = "<select id=\"colorOption\">\n      ";

    for (var c in colorAlgorithms) {
      selected = '';
      if (saveData.settings.colorAlgorithm === c) selected = 'selected';
      res += "<option value=\"".concat(c, "\" name=\"").concat(c, "\" ").concat(selected, ">").concat(c, "</option>\n          ");
    }

    res += "\n      </select>";
    return res;
  }

  $('animationSpeed').value = saveData.settings.speed * 1000;
  $('colorOptionWrapper').innerHTML = getColorSelectHTML();
  /**********************
   * Saving Features
   * Development from:
   * Nov 16 - Nov 18
   **********************/

  function showSaveData() {
    var ta = $('saveDataTextarea');
    ta.value = JSON.stringify(saveData);
  }

  function loadSaveData(element) {
    element = element.previousElementSibling.previousElementSibling;

    try {
      var toSave = JSON.parse(element.value);
    } catch (error) {
      toast('Invalid data structure<br><small style="font-weight:200"> ' + error + '</small>', 'error');
      return;
    }

    if (toSave.data.length <= 1) return toast('Invalid save code: no data', 'error', 'error');

    for (var i = 0; i < toSave.data.length; i++) {
      if (toSave.data[i].length != 2) return toast('Invalid save code <br><small style="font-weight:200">Data point ' + (i + 1) + ' has invalid coordinates</small>', 'error');
    }

    saveData = toSave;
    toast('Successfully loaded save code', 'success');
  }

  $('loadSaveDataBtn').onclick = function (e) {
    return loadSaveData(e.target);
  };

  showSaveData();
  /*********************
   * Quick Actions!
   ********************/

  $('quickPlay').onclick = function () {
    if (t >= 0.99) {
      replay();
      window.cancelAnimationFrame(advance);
    } else {
      playing = !playing;
      evaluatePlaying();
    }
  };
  /************************
  * Point Presets
  * 
  * Development from:
  * Nov 16 - Nov 18 2021
  ************************/


  var psc = $('presetSelectChoice');
  var presetEditorPages = ["<div><h1>Preset list</h1>".concat(getPresetListHTML(), "<button onclick=\"addPreset()\">Add Preset...</button></div>")];

  function presetEditorPage(index) {
    if (document.querySelector('.modal')) {
      removeModal();
      setTimeout(function () {
        showModal(index);
      }, 500);
      return;
    }

    showModal(index);
  }

  function showModal(index) {
    var modal = document.createElement('DIV');
    modal.classList.add("modal");
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = "<p id=\"close\" onclick=\"removeModal()\">&times;</p>" + presetEditorPages[index];
    var o = $('modalOverlay');
    o.appendChild(modal);
    o.classList.add('showing');
    setTimeout(function () {
      modal.classList.add("showing");
    });

    onkeydown = function onkeydown(e) {
      if (e.key == 'Escape') removeModal();
    };
  }

  function removeModal() {
    document.querySelector('.modal').classList.remove('showing');
    document.querySelector('#modalOverlay').classList.remove('showing');
    setTimeout(function () {
      document.querySelector('.modal').remove();
    }, 500);

    onkeydown = function onkeydown() {};
  }

  function getPresetListHTML() {
    var res = "<div id=\"presetChoice\">\n\t\t\t";

    for (var i = 0; i < saveData.presets.length; i++) {
      res += "\t<div class=\"preset\"><h1>".concat(saveData.presets[i].name, "</h1><button onclick=\"removePreset(").concat(i, ");toast('Preset ").concat(saveData.presets[i].name, " successfully deleted','success');this.parentElement.remove()\">Delete</button><button onclick=\"editPresetData(").concat(i, ")\">Edit Data</button><button onclick=\"changePresetName(").concat(i, ");\">Rename</button></div>\n\t\t\t\t");
    }

    res += "\n\t\t\t</div>";
    return res;
  }

  function getPresetSelectHTML() {
    var res = "<select id=\"presetChoice\">\n\t\t\t";

    for (var i = 0; i < saveData.presets.length; i++) {
      selected = '';
      if (saveData.presets[i].data == saveData.data) selected = 'selected';
      res += "<option value=\"".concat(i, "\" ").concat(selected, ">").concat(saveData.presets[i].name, "</option>\n\t\t\t\t");
    }

    res += "\n\t\t\t</select>";
    return res;
  }

  function removePreset(index) {
    saveData.presets.splice(index, 1);
    updatePresetPage();
    psc.innerHTML = getPresetSelectHTML();
  }

  function updatePresetPage() {
    presetEditorPages = ["\n\t\t  <p id=\"close\" onclick=\"removeModal()\">&times;</p><div><h1>Preset list</h1>".concat(getPresetListHTML(), "</div>\n\t  ")];
  }

  function changePresetName(index) {
    var newName = prompt('New preset name:');
    if (newName === '') return toast('Name cannot be empty', 'error');else if (newName === null) return;
    saveData.presets[index].name = newName;
    $('presetChoice').remove();
    document.querySelector('.modal').innerHTML += getPresetListHTML();
    updatePresetPage();
    psc.innerHTML = getPresetSelectHTML();
  }

  function editPresetData(index) {
    presetEditorPages[1] = "<p id=\"close\" onclick=\"removeModal()\">&times;</p><div><h1>Editing data for ".concat(saveData.presets[index].name, "</h1><textarea style=\"width:200px; height:300px\">").concat(JSON.stringify(saveData.presets[index].data).replace(/\]\,/g, '],&#13;&#10;').replace(/\[\[/g, '[&#13;&#10;[').replace(/\]\]/g, ']&#13;&#10;]'), "</textarea><button onclick=\"savePresetData(").concat(index, ",this.previousElementSibling)\">Save</button>");
    presetEditorPage(1);
    psc.innerHTML = getPresetSelectHTML();
  }

  function savePresetData(index, textarea) {
    saveData.presets[index].data = JSON.parse(textarea.value.replace('&#13;&#10;', ''));
    toast('Successfully edited preset ' + saveData.presets[index].name, 'success');
  }

  function addPreset() {
    presetEditorPages[2] = "<p id=\"close\" onclick=\"removeModal()\">&times;</p>\n\t\t\t<div>\n\t\t\t<button onclick=\"presetEditorPage(0)\">Back</button>\n\t\t\t<h1>New preset</h1>\n\t\t\t<p>Name:</p>\n\t\t\t<input type=\"text\" id=\"presetName\" placeholder=\"Name\"><br>\n\t\t\t<p>Data:</p>\n\t\t\t<textarea  id=\"presetData\" style=\"width:300px; height:200px\">[\n\t\t\t[0, 0],\n\t\t\t[0, 0]\n\t\t]</textarea><br>\n\t\t\t  <p>View options:</p>\n\t\t\t  <div id=\"presetViewOptions\">\n\t\t\t\t  <input type=\"checkbox\" value=\"lines\" id=\"plines\" checked><label for=\"plines\">Show lines</label><br>\n\t\t\t\t  <input type=\"checkbox\" value=\"midpoints\"id=\"pmidpoints\" checked><label for=\"pmidpoints\">Show midpoints</label><br>\n\t\t\t\t  <input type=\"checkbox\" value=\"trail\" id=\"ptrail\" checked><label for=\"ptrail\">Show trail</label><br>\n\t\t\t\t  <input type=\"checkbox\" value=\"controlpoints\" id=\"pcontrolpoints\" checked><label for=\"pcontrolpoints\">Show control points</label><br>\n\t\t\t\t  <input type=\"checkbox\" value=\"finalmidpoint\" id=\"pfinalmidpoint\" checked><label for=\"pfinalmidpoint\">Show final midpoints</label><br>\n\t\t\t  </div><br>\n\t\t\t<p style=\"width:400px\">Each point's x & y coordinates is wrapped in brackets []. Example: [100, 130]. This will make a point at x 100 and y 130.</p>\n\t\t\t<br>\n\t\t\t<button onclick=\"parseAndAddPreset($('presetName'),$('presetData'),$('presetViewOptions'))\">Create preset</button>";
    presetEditorPage(2);
  }

  function parseAndAddPreset(name, data, viewOpts) {
    var newInd = saveData.presets.length;
    saveData.presets[newInd] = {};
    saveData.presets[newInd].name = name.value;
    saveData.presets[newInd].show = {
      "lines": null,
      "midpoints": null,
      "trail": null,
      "controlpoints": null,
      "finalmidpoint": null
    };

    try {
      var newData = JSON.parse(data.value);
    } catch (err) {
      toast('Invalid data structure <br><small style="font-weight:200">' + error + '</small>', 'error');
      return;
    }

    if (newData.length < 2) {
      toast('Please add more than 1 point', 'error');
      return;
    }

    for (var i = 0; i < newData.length; i++) {
      if (newData[i].length != 2) {
        toast('Point ' + (i + 1) + ' does not have proper coordinates.', 'error');
      }
    }

    for (var _i = 0; _i < viewOpts.children.length; _i++) {
      if (viewOpts.children[_i].checked) {
        saveData.presets[newInd].show[viewOpts.children[_i].value] = true;
      } else saveData.presets[newInd].show[viewOpts.children[_i].value] = false;
    }

    saveData.presets[newInd].data = JSON.parse(data.value);
    psc.innerHTML = getPresetSelectHTML();
    toast('Added preset ' + name.value + ' successfully', 'success');
    save.set();
    return presetEditorPage(0);
  }

  psc.oninput = function () {
    loadPreset(parseInt(psc.value));
    save.set();
  };

  function loadPreset(number) {
    var toupdate = saveData.presets[number];
    saveData.data = toupdate.data;
    var newShow;

    if (toupdate.show === null) {
      newShow = {
        "lines": true,
        "midpoints": true,
        "trail": true,
        "controlpoints": true,
        "finalmidpoint": true
      };
    } else newShow = toupdate.show;

    saveData.settings.show = newShow;
    replay();
    save.set();
    updateCheckboxes();
  }

  $('presetSelectChoice').innerHTML = getPresetSelectHTML();
})();