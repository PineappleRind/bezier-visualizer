function lerp(start, end, amt) {
	return Math.round(((1 - amt) * start + amt * end) * 100) / 100;
}

function easeInOutQuad(x) {
	return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function easeInOutExpo(x) {
	return x === 0 ?
		0 :
		x === 1 ?
			1 :
			x < 0.5 ?
				Math.pow(2, 20 * x - 10) / 2 :
				(2 - Math.pow(2, -20 * x + 10)) / 2;
}

function easeInOutQuart(x) {
	return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
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
		[331, 351],
		[38, 351],
		[331, 14],
		[38, 14],
	],

	computed: [],
	presets: [{
		name: "Default",
		data: [
			[30, 250],
			[250, 250],
			[30, 30],
			[250, 30]
		]
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
		]
	}]
};

var save = {
	getData: function () {
		return JSON.parse(localStorage.getItem("bezierSaveData"));
	},
	set: function () {
		return localStorage.setItem("bezierSaveData", JSON.stringify(points));
	},
};
if (!save.getData()) {
	save.set();
} else {
	points.data = save.getData().data;
	points.computed = save.getData().computed
}

function goldenAngle(number) {
	const hue = number * 137.50776405; // use golden angle approximation
	return `hsl(${hue},100%,50%)`;
}

function rainbow(number) {
	return (`hsl(${number * 20},100%,50%)`)
}

function grayscale(number) {
	let newnum = `hsl(0,0%,${number / points.data.length * 100}%)`
	console.log(newnum)
	return newnum
}
var colors = []
var settings = {
	speed: 0.002,
	ease: window.easeInOutQuad,
	show: {
		lines: true,
		midpoints: true,
		trail: true,
		controlpoints: true,
		finalmidpoint: true
	},
	colorAlgorithm: window.goldenAngle
}
var psc = document.getElementById('presetSelectChoice')
for (let i = 0; i < points.data.length; i++) {
	colors.push(settings.colorAlgorithm(i))
}

let iteration = points.data.length - 1;
var playing = true;

var canvas = {
	element: document.getElementById("canvas"),
	context: document.getElementById("canvas").getContext("2d"),
	clear: function () {
		canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height);
	},
}
var trail = {
	element: document.getElementById("canvas2"),
	context: document.getElementById("canvas2").getContext("2d"),
	clear: function () {
		trail.context.clearRect(0, 0, canvas.element.width, canvas.element.height);
	}
}

var t = 0,
	colorIteration = 1

function addPoint(x, y) {
	colorIteration++
	colors.push(rainbow(colorIteration))
	if (!x) x = 0
	if (!y) y = 0
	points.data.push([x, y])
	iteration = points.data.length - 1;
	initialPoints()
	save.set()
}

function com(easedT) {
	iteration = points.data.length - 1;
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
canvas.element.setAttribute('height', window.innerHeight)
canvas.element.setAttribute('width', window.innerWidth)
trail.element.setAttribute('height', window.innerHeight)
trail.element.setAttribute('width', window.innerWidth)
onresize = () => {
	canvas.element.setAttribute('height', window.innerHeight)
	canvas.element.setAttribute('width', window.innerWidth)
	trail.element.setAttribute('height', window.innerHeight)
	trail.element.setAttribute('width', window.innerWidth);
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

function evaluatePlaying() {
	if (playing === true) window.requestAnimationFrame(advance), (document.getElementById("playBtn").innerHTML = "Stop");
	else window.cancelAnimationFrame(advance), (document.getElementById("playBtn").innerHTML = "Play")
}
window.requestAnimationFrame(advance)

function replay() {
	t = 0;
	canvas.clear()
	trail.clear()
	window.cancelAnimationFrame(advance)
	window.requestAnimationFrame(advance), (document.getElementById("playBtn").innerHTML = "Stop");
	playing = true;
}

function advance() {
	canvas.clear();
	document.getElementById("speedometer").innerHTML =
		"t=" + settings.ease(t).toFixed(2);
	t += settings.speed;
	easedT = settings.ease(t);
	com(easedT);
	let final = drawMidPoints();
	drawTrail(final[0], final[1])
	initialPoints();
	if (t >= 1 || playing === false) window.cancelAnimationFrame(advance);
	else window.requestAnimationFrame(advance);
}

function resetCurve() {
	points = {
		data: [
			[331, 351],
			[38, 351],
			[331, 14],
			[38, 14],
		],
		computed: [],
		presets: points.presets
	};
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
		for (var i = 0; i < points.data.length; i++) {
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
		points.data[pointIndex][0] = x;
		points.data[pointIndex][1] = y;
		canvas.clear();
		initialPoints();
		save.set();
	}
}

function removePointHandler(evt) {
	var x = evt.clientX;
	var y = evt.clientY;
	var iter = 0
	for (var i = 0; i < points.data.length; i++) {
		if (intersectingPoints(x, y, i) === true && points.data.length <= 2) {
			toast('You can\'t have less than 2 points!')
			break;
		}
		if (intersectingPoints(x, y, i) === true && points.data.length > 2) {
			dragging = i
			points.data = arrRemove(points.data, points.data[i])
			canvas.clear();
			save.set();
			iteration = points.data.length - 1
			initialPoints()
			dragging = -1
			break;
		} else {
			iter++

			if (i == points.data.length - 1 && iter == points.data.length - 1) {
				break
			} else if (i == points.data.length - 1 && iter == points.data.length) {
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
	return ((((x >= points.data[i][0] && x <= points.data[i][0] + 10) ||
		(x <= points.data[i][0] && x >= points.data[i][0] - 10)) &&
		((y >= points.data[i][1] && y <= points.data[i][1] + 10) ||
			(y <= points.data[i][1] && y >= points.data[i][1] - 10))) ||
		dragging === i)
}

function initialPoints() {
	if (settings.show.lines == true) {
		for (var i = 0; i < points.data.length - 1; i++) {
			line(
				points.data[i][0],
				points.data[i][1],
				points.data[i + 1][0],
				points.data[i + 1][1]
			);
		}
	}
	for (var i = 0; i < points.data.length; i++) {
		if (settings.show.controlpoints === true) point(points.data[i][0], points.data[i][1], 10, colors[i]); // Anchor dots
	}
}

function drawMidPoints() {
	for (let i = 0; i < points.computed.length; i++) {
		for (let j = 0; j < points.computed[i].length; j++) {
			let radius = 3
			if (i === points.computed.length - 1 && settings.show.finalmidpoint === true) radius = 10
			if (settings.show.midpoints == true || (radius == 10 && settings.show.finalmidpoint == true)) {
				point(
					points.computed[i][j][0],
					points.computed[i][j][1],
					radius
				)
			}
			if (settings.show.lines == true) {
				if (j > 0) line(
					points.computed[i][j][0], points.computed[i][j][1],
					points.computed[i][j - 1][0], points.computed[i][j - 1][1]
				)
			}
			if (i === points.computed.length - 1) return [points.computed[i][j][0],
			points.computed[i][j][1]
			]
		}
	}
}

function drawTrail(x, y) {
	if (settings.show.trail == false) return
	trail.context.beginPath();
	trail.context.fillStyle = '#ffffff';
	trail.context.arc(x, y, 10, 0, 2 * Math.PI, true);
	trail.context.closePath();
	trail.context.fill();
}

document.getElementById("easeOption").oninput = function () {
	settings.ease = window[document.getElementById("easeOption").value];
};

document.getElementById("colorOption").oninput = function () {
	settings.colorAlgorithm = window[document.getElementById("colorOption").value];
	colors = []
	for (let i = 0; i < points.data.length; i++) {
		colors.push(settings.colorAlgorithm(i))
	}
};
oninput = e => {
	let target = e.target
	let toChange = target.getAttribute('id')
	settings.show[toChange] = !settings.show[toChange]
}

function computeTextColor(bgColor) {
	var color = (bgColor.value.charAt(0) === '#') ? bgColor.value.substring(1, 7) : bgColor.value;
	console.log(color)
	var r = parseInt(color.substring(0, 2), 16); // hexToR
	var g = parseInt(color.substring(2, 4), 16); // hexToG
	var b = parseInt(color.substring(4, 6), 16); // hexToB
	let final = (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
		'black' : 'white';
	if (document.body.classList.contains(final)) return
	else if (final == 'black' && document.body.classList.contains('white')) document.body.classList.remove('white')
	else if (final == 'white' && document.body.classList.contains('black')) document.body.classList.remove('black')
	else document.body.classList.add(final)
	return
}