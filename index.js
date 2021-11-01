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
};

var save = {
	get: function() {
		return JSON.parse(localStorage.getItem("bezierSaveData"));
	},
	set: function() {
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

function rainbow(number) {
	const hue = number * 137.50776405; // use golden angle approximation
	return `hsl(${hue},100%,50%)`;
}
var colors = []

for (let i = 0; i < points.data.length; i++) {
	colors.push(rainbow(i))
}

let iteration = points.data.length - 1;
var playing = true;

var canvas = {
	element: document.getElementById("canvas"),
	context: document.getElementById("canvas").getContext("2d"),
	clear: function() {
		canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height);
	},

}
var trail = {
	element: document.getElementById("canvas2"),
	context: document.getElementById("canvas2").getContext("2d"),
	clear: function() {
		trail.context.clearRect(0, 0, canvas.element.width, canvas.element.height);
	}
}
var settings = {
	speed: 0.002,
	ease: window.easeInOutQuart
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
	drawAndConnectInitialPoints()
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
	drawAndConnectInitialPoints()
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
		"t=" + settings.ease(t).toFixed(1);
	t += settings.speed;
	easedT = settings.ease(t);
	com(easedT);
	let final = drawMidPoints();
	drawTrail(final[0], final[1])
	drawAndConnectInitialPoints();
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
		computed: []
	};
	save.set();
}

var mouseIsDown = false;
var dragging = -1;
onmousedown = function() {
	mouseIsDown = true;
};
ontouchstart = function() {
	mouseIsDown = true;
};

onmouseup = function() {
	mouseIsDown = false;
	dragging = -1;
};
onmousemove = function(e) {
	pointHandler(e);
};
ontouchmove = function(e) {
	pointHandler(e.touches[0]);
};

function pointHandler(windowEvent) {

	if (mouseIsDown === true) {
		var x = windowEvent.clientX;
		var y = windowEvent.clientY;
		for (var i = 0; i < points.data.length; i++) {
			if (intersectingPoints(x, y, i) === true) {
				console.log(intersectingPoints(x, y, i))
				dragging = i
				if (x < 0) break;
				if (y < 0) break;
				if (x > window.innerWidth) break;
				if (y > window.innerHeight) break;
				points.data[i][0] = x;
				points.data[i][1] = y;
				canvas.clear();
				drawAndConnectInitialPoints()
				save.set();

				break;
			}
		}
	}
}

function removePointHandler(evt) {
	var x = evt.clientX;
	var y = evt.clientY;
	var iter = 0
	for (var i = 0; i < points.data.length; i++) {
		console.log(x + ' ' + y + '\n' + points.data[i][0] + ' ' + points.data[i][1] + '\n' + intersectingPoints(x, y, i))

		if (intersectingPoints(x, y, i) === true && points.data.length <= 2) {
			alert('You can\'t have less than 2 points!')
			console.log('Broken due to less than 2points')
			break;

		}
		if (intersectingPoints(x, y, i) === true && points.data.length > 2) {
			dragging = i
			console.log(dragging)
			points.data = arrRemove(points.data, points.data[i])
			canvas.clear();
			save.set();
			iteration = points.data.length - 1
			drawAndConnectInitialPoints()
			dragging = -1
			break;
		} else {
			iter++
			console.log(`${iter} ${points.data.length}`)
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
			i === points.computed.length - 1 ? radius = 10 : radius = 2
			point(
				points.computed[i][j][0],
				points.computed[i][j][1],
				radius
			)
			if (j > 0) line(
				points.computed[i][j][0], points.computed[i][j][1],
				points.computed[i][j - 1][0], points.computed[i][j - 1][1]
			)
			if (i === points.computed.length - 1) return [points.computed[i][j][0],
				points.computed[i][j][1]
			]
		}
	}
}

function drawTrail(x, y) {
	trail.context.beginPath();
	trail.context.fillStyle = "#ffffff";
	trail.context.arc(x, y, 10, 0, 2 * Math.PI, true);
	trail.context.closePath();
	trail.context.fill();
}

document.getElementById("easeOption").oninput = function() {
	settings.ease = window[document.getElementById("easeOption").value];
};