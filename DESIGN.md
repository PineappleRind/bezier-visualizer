# Current Code Design

$()

lerp()

bits

- bitfield
- total()
- compare()

saveData

- data
- presets
- settings

keybinds

- declare keybinds
- add event listeners

declare computed midpoints array

save

- getData()
- set()
- initial save

removeBanner()

- banner event listeners
- banner remove logic

colorAlgorithms

eases

- easeInOutQuad()
- easeInOutExpo()
- easeInOutQuart()
- bounce()
- linear()

colors

- declare array
- fill array with colors for each point

toast()

let toIterate, playing

canvas

trail

let t, colorIteration

addPoint()

compute()

resizeHandler()
call resizeHandler, updateCheckboxes

draw

- point
- line
- trail

button handlers

- #minimize
- #playBtn
- #quickPlay
- #replayBtn
- #quickReplay
- #resetCurveBtn
- #animationSpeed
- #tValue

evaluatePlaying()

call evaluatePlaying, updateCheckboxes

replay()

let prev = []

advance()

resetCurve()

let mouseIsDown, dragging

handlers

- onmousedown
- ontouchstart
- onmouseup
- onmousemove
- ontouchmove

pointHandler()

updatePoint()

removePointHandler()

arrRemove()

handler

- canvas.element.ondblclick = removePointHandler

intersectingPoints()

initialPoints()
drawMidPoints()

handlers

- #easeOption.oninput
- window.oninput

updateCheckboxes()

// dropdown for colorAlgorithms (it's dynamic™!)
getColorSelectHTML()

# To do

## SimulationManager

- eases
- evaulatePlaying
- replay
- colors
- t
- compute
- resetCurve
- updatePoint
- intersectingPoints

## CanvasManager

- bits
- keybinds
- pointHandler

## EventManager
