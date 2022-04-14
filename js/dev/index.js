(function () {
	function $(id) {
		return document.getElementById(id)
	}

	function lerp(start, end, amt) {
		return Math.round(((1 - amt) * start + amt * end) * 100) / 100;
	}

	var saveData = {
		data: [
			[331, 351],
			[38, 351],
			[331, 14],
			[38, 14],
		],
		presets: [{
			name: "Default",
			data: [
				[30, 250],
				[250, 250],
				[30, 30],
				[250, 30]
			],
			show: null
		}, {
			name: "Bow",
			data: [
				[143, 323],
				[482, 25],
				[54, 21],
				[113, 373],
				[231, 298],
				[482, 25],
				[54, 21],
				[279, 300],
				[371, 381],
				[483, 25],
				[54, 20],
				[357, 324]
			],
			show: null
		}, {
			name: "Cursive f",
			data: [
				[193, 313],
				[513, 246],
				[42, 42],
				[410, 6],
				[120, 586],
				[567, 521],
				[53, 339],
				[332, 283]
			],
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
		},
		{
			name: "Circle Warp",
			data: [
				[300, 600], [552, 462], [573, 175], [342, 3], [73, 104], [12, 385], [216, 588], [495, 528], [597, 256], [424, 27], [137, 48], [0, 301], [139, 553], [426, 572], [597, 341], [495, 72], [214, 13], [12, 217], [75, 498], [345, 597], [574, 422], [551, 136], [297, 0], [46, 140], [28, 427], [260, 597], [529, 494], [587, 212], [381, 11], [101, 76], [4, 346], [179, 574], [465, 550], [600, 296], [459, 45], [172, 29], [2, 262], [107, 530], [389, 587], [589, 380], [524, 100], [252, 4], [25, 180], [50, 467], [305, 600], [555, 458], [571, 170], [337, 2], [70, 108], [14, 390], [221, 589], [501, 523], [596, 251], [419, 25], [132, 51], [0, 307], [144, 556], [431, 570], [598, 336], [491, 69], [209, 14], [10, 223], [78, 502], [350, 596], [576, 418], [548, 131], [292, 0], [43, 145], [31, 432], [266, 598], [532, 490], [585, 207], [376, 10], [97, 79], [4, 352], [184, 577], [470, 547], [600, 291], [454, 43], [167, 31], [2, 267], [111, 533], [394, 585], [591, 375], [520, 96], [247, 5], [23, 185], [53, 471], [311, 600], [558, 453], [568, 166], [332, 2], [66, 112], [16, 395], [226, 591], [505, 519], [595, 246], [414, 22], [128, 54], [0, 312]
			],
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
	var { data, presets, show, settings } = saveData
	let buttonStates = {
		play: `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
                    <polygon fill="#ffffff" class="play-btn__svg" points="9.33 6.69 9.33 19.39 19.3 13.04 9.33 6.69" />
                <path fill="#ffffff" class="play-btn__svg"
                    d="M26,13A13,13,0,1,1,13,0,13,13,0,0,1,26,13ZM13,2.18A10.89,10.89,0,1,0,23.84,13.06,10.89,10.89,0,0,0,13,2.18Z" />
                    </svg>`,
		pause: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
                    viewBox="0 0 267 267" style="enable-background:new 0 0 26 26;">
                    <g>
                        <path style="fill:#ffffff;"
                            d="M135.977,271.953c75.097,0,135.977-60.879,135.977-135.977S211.074,0,135.977,0S0,60.879,0,135.977    S60.879,271.953,135.977,271.953z M135.977,21.756c62.979,0,114.22,51.241,114.22,114.22s-51.241,114.22-114.22,114.22    s-114.22-51.241-114.22-114.22S72.992,21.756,135.977,21.756z" />
                        <path style="fill:#ffffff;"
                            d="M110.707,200.114c7.511,0,13.598-6.086,13.598-13.598V83.174c0-7.511-6.086-13.598-13.598-13.598    c-7.511,0-13.598,6.086-13.598,13.598v103.342C97.109,194.028,103.195,200.114,110.707,200.114z" />
                        <path style="fill:#ffffff;"
                            d="M165.097,200.114c7.511,0,13.598-6.086,13.598-13.598V83.174c0-7.511-6.086-13.598-13.598-13.598    S151.5,75.663,151.5,83.174v103.342C151.5,194.028,157.586,200.114,165.097,200.114z" />
                    </g>
                </svg>`
	}
	let keybinds = {
		' ': () => {
			playing = !playing;
			if (t <= 0.01) trail.clear();
			else if (t >= 0.99) replay()
			evaluatePlaying();
		}, 'Enter': () => {
			$('controls').classList.toggle('hidden')
			$('quickActions').classList.toggle('hidden')
		}
	}
	for (const keybind in keybinds) {
		document.documentElement.addEventListener('keyup', function(e) {
			if (e.key === keybind) keybinds[keybind](e)
		})
	}
	let computed = []

	var save = {
		getData: function () {
			var { data, presets, show, settings } = saveData
			return JSON.parse(localStorage.getItem("bezierSaveData"));
		},
		set: function () {
			showSaveData()
			var { data, presets, show, settings } = saveData
			return localStorage.setItem("bezierSaveData", JSON.stringify(saveData));
		},
	};
	if (!save.getData()) save.set();
	else saveData = save.getData()
	
	let colorAlgorithms = {
		'goldenAngle': (number) => `hsl(${number * 137.50776405},100%,50%)`,
		'rainbow': (number) => {
			return (`hsl(${number * 20},100%,50%)`)
		},
		'grayscale': (number) => {
			return `hsl(0,0%,${number / data.length * 100}%)`
		}
	}
	var eases = {
		'easeInOutQuad': (x) => {
			return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
		}, 'easeInOutExpo': (x) => {
			return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
		}, 'easeInOutQuart': (x) => {
			return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
		}, 'bounce': (x) => {
			const n1 = 7.5625,
				d1 = 2.75;
			return x < 1 / d1 ? n1 * x * x : x < 2 / d1 ? n1 * (x -= 1.5 / d1) * x + .75 : x < 2.5 / d1 ? n1 * (x -= 2.25 / d1) * x + .9375 : n1 * (x -= 2.625 / d1) * x + .984375
		}, 'linear': (x) => {
			return x;
		}
	}

	var colors = []
	data.forEach(function (val, ind) {
		colors.push(colorAlgorithms[settings.colorAlgorithm](ind))
	})
	function toast(msg, theme) {
		let toast = document.createElement('DIV')
		toast.classList.add('toast')
		toast.classList.add(theme)
		toast.innerHTML = msg
		setTimeout(function () {
			toast.classList.add('showing')
			setTimeout(function () {
				toast.classList.remove('showing')
				setTimeout(function () {
					toast.remove()
				}, 500)
			}, 3000)
		})
		document.body.appendChild(toast)
	}
	let toIterate = data.length - 1;
	var playing = true;
	var canvas = {
		element: $("canvas"),
		context: $("canvas").getContext("2d"),
		clear: function () {
			canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height);
		},
	}
	var trail = {
		element: $("canvas2"),
		context: $("canvas2").getContext("2d"),
		clear: function () {
			trail.context.clearRect(0, 0, trail.element.width, trail.element.height);
		}
	}
	var t = 0,
		colorIteration = 1

	function addPoint(x, y) {
		colorIteration++
		colors.push(colorAlgorithms[settings.colorAlgorithm](colorIteration))
		if (!x) x = 0
		if (!y) y = 0
		data.push([x, y])
		toIterate = data.length - 1;
		initialPoints()
		save.set()
	}
	function com(easedT) {
		toIterate = saveData.data.length - 1;
		if (toIterate > 10) return 
		computed = Array.from({
			length: toIterate
		}, () => []);
		for (let i = 0; i < toIterate; i++) { // For each iteration of midpoints:            
			for (let point = 0; point < toIterate - i; point++) { //For each point in the iteration of midpoints: 
				if (i === 0) { // If it's the first iteration         
					computed[i].push([
					  lerp(saveData.data[point][0], saveData.data[point + 1][0], easedT), 
					  lerp(saveData.data[point][1], saveData.data[point + 1][1], easedT)
					]);
				} else if (i != 0 && point < toIterate - i) { // If it's not the first iteration     
					computed[i].push([
					  lerp(computed[i - 1][point][0], computed[i - 1][point + 1][0], easedT), 
					  lerp(computed[i - 1][point][1], computed[i - 1][point + 1][1], easedT)
					])
				}
			}
		}
		console.log(computed)
	}
	function resizeHandler() {
		canvas.element.setAttribute('height', window.innerHeight);
		canvas.element.setAttribute('width', window.innerWidth);
		trail.element.setAttribute('height', window.innerHeight);
		trail.element.setAttribute('width', window.innerWidth);
	}
	resizeHandler();
	onresize = () => {
		resizeHandler()
		initialPoints()
	}
	function point(x, y, rad, col) {
		canvas.context.beginPath();
		canvas.context.arc(x, y, rad, 0, 2 * Math.PI, true);
		canvas.context.closePath();
		if (!col) canvas.context.fillStyle = "#ffffff";
		else canvas.context.fillStyle = col;
		canvas.context.fill();
	}

	function line(startx, starty, finishx, finishy) {
		canvas.context.beginPath();
		canvas.context.strokeStyle = "#ffffff";
		canvas.context.moveTo(startx, starty);
		canvas.context.lineTo(finishx, finishy);
		canvas.context.stroke(); // Bottom side line
	}

	$('minimize').onclick = e => {
		e.target.parentElement.classList.toggle('hidden'); 
		e.target.parentElement.nextElementSibling.classList.toggle('hidden')
	}
	$('playBtn').onclick = e => {
		playing = !playing;
		if (t <= 0.01) trail.clear();
		evaluatePlaying();
	}
	$('replayBtn').onclick = replay
	$('resetCurveBtn').onclick = resetCurve
	$('quickReplay').onclick = replay
	$('animationSpeed').oninput = e => saveData.settings.speed = e.target.value / 1000

	function evaluatePlaying() {
		let playbtn = $('quickPlay')
		if (playing === true) {
			window.requestAnimationFrame(advance);
			 $('quickPlay').classList.add('playing');
		} else {
			window.cancelAnimationFrame(advance)
			$('quickPlay').classList.remove('playing');
		}
		$("playBtn").innerHTML = playing ? "Stop" : "Play";
		if (playbtn.classList.contains('playing')) playbtn.innerHTML = buttonStates.pause
		else playbtn.innerHTML = buttonStates.play
	}
	evaluatePlaying()
	updateCheckboxes()
	function replay() {
		playing ? window.cancelAnimationFrame(advance) : window.requestAnimationFrame(advance)
		t = 0;
		canvas.clear()
		trail.clear()
		playing = true;
		initialPoints()
	}
	let prev = []
	function advance() {
		canvas.clear();
		if (!saveData.settings.ease) saveData.settings.ease = 'quadraticEaseInOut'
		$("speedometer").innerHTML =
			"t=" + eases[saveData.settings.ease](t).toFixed(3);
		t += saveData.settings.speed;
		com(eases[saveData.settings.ease](t));
		let final = drawMidPoints();
		drawTrail(final[0], final[1], prev[0], prev[1])
		prev = final
		window.cancelAnimationFrame(advance)
		initialPoints();
		if (t >= 1 || playing === false) {
			playing = false;
			evaluatePlaying()
		}
		else window.requestAnimationFrame(advance)
	}
	function resetCurve() {
		saveData.data = [
			[331, 351],
			[38, 351],
			[331, 14],
			[38, 14],
		]
		save.set();
	}
	var mouseIsDown = false;
	var dragging = -1,
		draggingPoint = -1;
	onmousedown = function () {
		mouseIsDown = true;
	};
	ontouchstart = function () {
		mouseIsDown = true;
	};
	onmouseup = function () {
		mouseIsDown = false;
		dragging = -1;
		draggingPoint = -1;
	};
	onmousemove = function (e) {
		pointHandler(e);
	};
	ontouchmove = function (e) {
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
					if (dragging == -1) dragging = i
					if (x < 0) break;
					if (y < 0) break;
					if (x > window.innerWidth) break;
					if (y > window.innerHeight) break;
					updatePoint(i)
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
		var iter = 0
		for (var i = 0; i < saveData.data.length; i++) {
			if (intersectingPoints(x, y, i) === true && saveData.data.length <= 2) {
				toast('You can\'t have less than 2 points', 'info')
				break;
			}
			if (intersectingPoints(x, y, i) === true && saveData.data.length > 2) {
				dragging = i
				saveData.data = arrRemove(saveData.data, saveData.data[i])
				canvas.clear();
				save.set();
				toIterate = saveData.data.length - 1
				initialPoints()
				dragging = -1
				break;
			} else {
				iter++
				if (i == saveData.data.length - 1 && iter == saveData.data.length - 1) {
					break
				} else if (i == saveData.data.length - 1 && iter == saveData.data.length) {
					addPoint(x, y)
					break
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
	canvas.element.ondblclick = e => {
		removePointHandler(e)
	}

	function intersectingPoints(x, y, i) {
		const { data } = saveData
		return ((((x >= data[i][0] && x <= data[i][0] + 10) ||
			(x <= data[i][0] && x >= data[i][0] - 10)) &&
			((y >= data[i][1] && y <= data[i][1] + 10) ||
				(y <= data[i][1] && y >= data[i][1] - 10))) ||
			dragging === i)
	}

	function initialPoints() {
		const { data, settings } = saveData
		if (settings.show.lines == true) {
			for (var i = 0; i < data.length - 1; i++) {
				line(
					data[i][0],
					data[i][1],
					data[i + 1][0],
					data[i + 1][1]
				);
			}
		}
		for (var i = 0; i < data.length; i++) {
			if (settings.show.controlpoints === true) point(data[i][0], data[i][1], 10, colors[i]); // Anchor dots
		}
	}

	function drawMidPoints() {
		const { show } = saveData.settings
		for (let i = 0; i < computed.length; i++) {
			for (let j = 0; j < computed[i].length; j++) {
				let radius = 3
				if (i === computed.length - 1 && show.finalmidpoint === true) radius = 10
				if (show.midpoints == true || (radius == 10 && show.finalmidpoint == true)) {
					point(
						computed[i][j][0],
						computed[i][j][1],
						radius
					)
				}
				if (show.lines == true && j > 0) line(
						computed[i][j][0], computed[i][j][1],
						computed[i][j - 1][0], computed[i][j - 1][1]
				)
				if (i === computed.length - 1) return [ computed[i][j][0], computed[i][j][1] ]
			}
		}
	}

	function drawTrail(x, y, prevX, prevY) {
		if (saveData.settings.show.trail == false) return
		if ((!prevX && !prevY) || t < 0.03) prevX = x, prevY = y
		const { context } = trail
		const dist = (point1,point2) => Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
		let distance = dist({x: prevX, y: prevY}, {x: x, y: y})
		if (distance > Math.PI*2) { // If the points are too far from each other..
			for (let i = 0; i < distance; i++) {
				context.beginPath() // Fill them in!
				context.fillStyle = '#ffffff'
				context.arc(lerp(prevX,x,i/distance), lerp(prevY,y,i/distance), 10, 0, Math.PI*2, true);
				context.fill()
			}
		}
		
		context.beginPath()
		context.fillStyle = '#ffffff'
		context.arc(x, y, 10, 0, Math.PI*2, true);
		context.fill()
	}
	$("easeOption").oninput = function () {
		saveData.settings.ease = $("easeOption").value;
		save.set()
	};
	$("colorOption").oninput = function () {
		saveData.settings.colorAlgorithm = $("colorOption").value;
		colors = []
		saveData.data.forEach(function (val, ind) {
			colors.push(colorAlgorithms[saveData.settings.colorAlgorithm](ind))
		})
		save.set()
	};
	oninput = e => {
		let target = e.target
		if (target.tagName === 'TEXTAREA') return
		let toChange = target.getAttribute('id')
		saveData.settings.show[toChange] = !saveData.settings.show[toChange]
		save.set()
	}
	function updateCheckboxes() {
		for (let i = 0; i < document.querySelectorAll('.showCheckbox').length; i++) {
			let cur = document.querySelectorAll('.showCheckbox')[i]
			let objKey = saveData.settings.show[Object.keys(saveData.settings.show)[i]]
			if (objKey === true) cur.checked = true
			else cur.checked = false
		}
	}

	function getColorSelectHTML() {
		let res = `<select id="colorOption">
      `
		for (const c in colorAlgorithms) {
			selected = ''
			if (saveData.settings.colorAlgorithm === c) selected = 'selected'
			res += `<option value="${c}" name="${c}" ${selected}>${c}</option>
          `
		}
		res += `
      </select>`
		return res
	}
	$('animationSpeed').value = saveData.settings.speed * 1000
	$('colorOptionWrapper').innerHTML = getColorSelectHTML()
	/**********************
	 * Saving Features
	 * Development from:
	 * Nov 16 - Nov 18
	 **********************/
	function showSaveData() {
		let ta = $('saveDataTextarea')
		ta.value = JSON.stringify(saveData)
	}
	function loadSaveData(element) {
		element = element.previousElementSibling.previousElementSibling
		try {
			var toSave = JSON.parse(element.value)
		} catch (error) {
			toast('Invalid data structure<br><small style="font-weight:200"> ' + error + '</small>', 'error')
			return
		}

		if (toSave.data.length <= 1) return toast('Invalid save code: no data', 'error', 'error')
		for (let i = 0; i < toSave.data.length; i++) {
			if (toSave.data[i].length != 2) return toast('Invalid save code <br><small style="font-weight:200">Data point ' + (i + 1) + ' has invalid coordinates</small>', 'error')
		}
		saveData = toSave
		toast('Successfully loaded save code', 'success')
	}
	$('loadSaveDataBtn').onclick = e => loadSaveData(e.target)

	showSaveData()


	/*********************
	 * Quick Actions!
	 ********************/


	$('quickPlay').onclick = () => {
		if (t >= 0.99) {
			replay(); window.cancelAnimationFrame(advance)
		} else {
			playing = !playing
			evaluatePlaying()
		}
	}
	/************************
* Point Presets
* 
* Development from:
* Nov 16 - Nov 18 2021
************************/

	var psc = $('presetSelectChoice')
	var presetEditorPages = [`<div><h1>Preset list</h1>${getPresetListHTML()}<button onclick="addPreset()">Add Preset...</button></div>`,]

	function presetEditorPage(index) {
		if (document.querySelector('.modal')) {
			removeModal();
			setTimeout(function () {
				showModal(index)
			}, 500)
			return
		}
		showModal(index)
	}

	function showModal(index) {
		let modal = document.createElement('DIV')
		modal.classList.add("modal")
		modal.setAttribute('aria-modal', 'true')
		modal.innerHTML = `<p id="close" onclick="removeModal()">&times;</p>` + presetEditorPages[index]
		let o = $('modalOverlay')
		o.appendChild(modal)
		o.classList.add('showing')
		setTimeout(function () {
			modal.classList.add("showing")
		})
		onkeydown = e => {
			if (e.key == 'Escape') removeModal();
		}
	}

	function removeModal() {
		document.querySelector('.modal').classList.remove('showing');
		document.querySelector('#modalOverlay').classList.remove('showing');
		setTimeout(() => {
			document.querySelector('.modal').remove();
		}, 500);
		onkeydown = () => { };
	}

	function getPresetListHTML() {
		let res = `<div id="presetChoice">
			`
		for (let i = 0; i < saveData.presets.length; i++) {
			res += `	<div class="preset"><h1>${saveData.presets[i].name}</h1><button onclick="removePreset(${i});toast('Preset ${saveData.presets[i].name} successfully deleted','success');this.parentElement.remove()">Delete</button><button onclick="editPresetData(${i})">Edit Data</button><button onclick="changePresetName(${i});">Rename</button></div>
				`
		}
		res += `
			</div>`
		return res
	}

	function getPresetSelectHTML() {
		let res = `<select id="presetChoice">
			`
		for (let i = 0; i < saveData.presets.length; i++) {
			selected = ''
			if (saveData.presets[i].data == saveData.data) selected = 'selected'
			res += `<option value="${i}" ${selected}>${saveData.presets[i].name}</option>
				`
		}
		res += `
			</select>`
		return res
	}

	function removePreset(index) {
		saveData.presets.splice(index, 1);
		updatePresetPage()
		psc.innerHTML = getPresetSelectHTML()
	}
	function updatePresetPage() {
		presetEditorPages = [`
		  <p id="close" onclick="removeModal()">&times;</p><div><h1>Preset list</h1>${getPresetListHTML()}</div>
	  `]
	}
	function changePresetName(index) {
		let newName = prompt('New preset name:')
		if (newName === '') return toast('Name cannot be empty', 'error')
		else if (newName === null) return
		saveData.presets[index].name = newName
		$('presetChoice').remove()
		document.querySelector('.modal').innerHTML += getPresetListHTML()
		updatePresetPage()
		psc.innerHTML = getPresetSelectHTML()
	}


	function editPresetData(index) {
		presetEditorPages[1] = `<p id="close" onclick="removeModal()">&times;</p><div><h1>Editing data for ${saveData.presets[index].name}</h1><textarea style="width:200px; height:300px">${JSON.stringify(saveData.presets[index].data).replace(/\]\,/g, '],&#13;&#10;').replace(/\[\[/g, '[&#13;&#10;[').replace(/\]\]/g, ']&#13;&#10;]')}</textarea><button onclick="savePresetData(${index},this.previousElementSibling)">Save</button>`
		presetEditorPage(1)
		psc.innerHTML = getPresetSelectHTML()
	}

	function savePresetData(index, textarea) {
		saveData.presets[index].data = JSON.parse(textarea.value.replace('&#13;&#10;', ''))
		toast('Successfully edited preset ' + saveData.presets[index].name, 'success')
	}

	function addPreset() {
		presetEditorPages[2] = `<p id="close" onclick="removeModal()">&times;</p>
			<div>
			<button onclick="presetEditorPage(0)">Back</button>
			<h1>New preset</h1>
			<p>Name:</p>
			<input type="text" id="presetName" placeholder="Name"><br>
			<p>Data:</p>
			<textarea  id="presetData" style="width:300px; height:200px">[
			[0, 0],
			[0, 0]
		]</textarea><br>
			  <p>View options:</p>
			  <div id="presetViewOptions">
				  <input type="checkbox" value="lines" id="plines" checked><label for="plines">Show lines</label><br>
				  <input type="checkbox" value="midpoints"id="pmidpoints" checked><label for="pmidpoints">Show midpoints</label><br>
				  <input type="checkbox" value="trail" id="ptrail" checked><label for="ptrail">Show trail</label><br>
				  <input type="checkbox" value="controlpoints" id="pcontrolpoints" checked><label for="pcontrolpoints">Show control points</label><br>
				  <input type="checkbox" value="finalmidpoint" id="pfinalmidpoint" checked><label for="pfinalmidpoint">Show final midpoints</label><br>
			  </div><br>
			<p style="width:400px">Each point's x & y coordinates is wrapped in brackets []. Example: [100, 130]. This will make a point at x 100 and y 130.</p>
			<br>
			<button onclick="parseAndAddPreset($('presetName'),$('presetData'),$('presetViewOptions'))">Create preset</button>`
		presetEditorPage(2)
	}

	function parseAndAddPreset(name, data, viewOpts) {
		let newInd = saveData.presets.length
		saveData.presets[newInd] = {}
		saveData.presets[newInd].name = name.value
		saveData.presets[newInd].show = { "lines": null, "midpoints": null, "trail": null, "controlpoints": null, "finalmidpoint": null }
		try {
			var newData = JSON.parse(data.value)
		} catch (err) {
			toast('Invalid data structure <br><small style="font-weight:200">' + error + '</small>', 'error')
			return
		}
		if (newData.length < 2) {
			toast('Please add more than 1 point', 'error')
			return
		}
		for (let i = 0; i < newData.length; i++) {
			if (newData[i].length != 2) {
				toast('Point ' + (i + 1) + ' does not have proper coordinates.', 'error')
			}
		}
		for (let i = 0; i < viewOpts.children.length; i++) {
			if (viewOpts.children[i].checked) {
				saveData.presets[newInd].show[viewOpts.children[i].value] = true
			} else saveData.presets[newInd].show[viewOpts.children[i].value] = false
		}
		saveData.presets[newInd].data = JSON.parse(data.value)
		psc.innerHTML = getPresetSelectHTML()
		toast('Added preset ' + name.value + ' successfully', 'success')
		save.set()
		return presetEditorPage(0)
	}
	psc.oninput = () => {
		loadPreset(parseInt(psc.value))
		save.set()
	}
	function loadPreset(number) {
		let toupdate = saveData.presets[number]
		saveData.data = toupdate.data
		let newShow
		if (toupdate.show === null) {
			newShow = {
				"lines": true,
				"midpoints": true,
				"trail": true,
				"controlpoints": true,
				"finalmidpoint": true
			}
		} else newShow = toupdate.show
		saveData.settings.show = newShow
		replay()
		save.set()
		updateCheckboxes()
	}
	$('presetSelectChoice').innerHTML = getPresetSelectHTML()
})()