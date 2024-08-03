// Draws stuff to canvas.
import { $ } from "./utils";

export default class Renderer {
  constructor() {
    this.canvas = {
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

    this.trail = {
      element: $("#trail"),
      context: $("#trail").getContext("2d"),
      clear: function () {
        trail.context.clearRect(
          0,
          0,
          trail.element.width,
          trail.element.height
        );
      },
    };
  }

  rendercontrolPoints() {
    const { data: d } = data;
    for (var i = 0; i < d.length; i++) {
      // if the user is showing lines
      // draw a line between it and the next one
      if (show.isShowing(show.lines) && i < d.length - 1)
        draw.line(d[i][0], d[i][1], d[i + 1][0], d[i + 1][1]);

      // if the user is showing control points
      // draw a control point
      if (show.isShowing(show.controlPoints))
        draw.point(d[i][0], d[i][1], 10, colors[i]); // Anchor dots
    }
  }

  // draw the midpoints computed by Bezier.compute()
  drawMidPoints(computed) {
    // for each iteration of midpoints
    for (let i = 0; i < computed.length; i++) {
      // for each midpoint in that iteration
      for (let j = 0; j < computed[i].length; j++) {
        // default dot radius = 3px
        let radius = 3;
        // final midpoint radius = 10px
        if (i === computed.length - 1 && show.isShowing(show.finalPoint))
          radius = 10;

        // user is showing midpoints? draw the point
        if (
          show.isShowing(show.midpoints) ||
          (radius === 10 && show.isShowing(show.finalPoint))
        ) {
          draw.point(computed[i][j][0], computed[i][j][1], radius);
        }

        // user is showing lines? draw lines in between midpoints
        if (show.isShowing(show.lines) && j > 0)
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
}
