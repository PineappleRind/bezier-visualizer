export default class Bezier {
  // this is the algorithm itself
  // this stumped me for a week 😅
  compute(easedT) {
    let iterationCount = this.points.length - 1;
    // array filled with arrays with length of toIterate
    let computed = Array.from(iterationCount)
      .map(() => null)
      .fill([]);

    // for each iteration of midpoints:
    for (let i = 0; i < iterationCount; i++) {
      // for each point in the iteration of midpoints:
      for (let point = 0; point < iterationCount - i; point++) {
        // if it's the first iteration, compute based on the control points.
        // otherwise base it on the previous iteration's midpoints
        let lerpOn = i === 0 ? this.points : computed[i - 1];
        computed[i].push([
          lerp(lerpOn[point][0], lerpOn[point + 1][0], easedT),
          lerp(lerpOn[point][1], lerpOn[point + 1][1], easedT),
        ]);
      }
    }
    return computed;
  }
}
