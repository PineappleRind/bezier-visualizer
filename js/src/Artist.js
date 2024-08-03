export default class Artist {
  constructor(ctx) {
    this.ctx = ctx;
  }
  lerp = (start, end, amt) =>
    Math.round(((1 - amt) * start + amt * end) * 100) / 100;

  point(x, y, rad, color) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, rad, 0, 2 * Math.PI, true);
    this.ctx.closePath();
    if (!color) this.ctx.fillStyle = "#ffffff";
    else this.ctx.fillStyle = color;
    this.ctx.fill();
  }
  line(startx, starty, finishx, finishy) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.moveTo(startx, starty);
    this.ctx.lineTo(finishx, finishy);
    this.ctx.stroke(); // Bottom side line
  }
  trail(x, y, prevX, prevY) {
    if (!show.isShowing(show.trail)) return;
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
  }
}
