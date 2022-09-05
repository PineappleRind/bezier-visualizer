# 2022-09-05
—— Design Updates ——
- Toast animation is more subtle and looks better

—— Code Optimization and Bug Fixes ——

- Bug fix \[spotted 2022-09-01\]: duplicate `requestAnimationFrame()` caused animation to play twice as fast upon `replay()` 
- The playing boolean is now a setter that calls `evaluatePlaying()` automatically when set
# 2022-09-01

- Prettier, if you haven't noticed already


—— Behaviour Changes ——

- Added labels for animation speed and t value
- Added a slider for t value


—— Design Updates ——

- Sliders and checkboxes are now not using the native browser design anymore. Checkboxes especially look beautiful :heart_eyes:
- The t value in the bottom left (speedometer) now only shows when the controls are minimized


—— Code Optimization and Bug Fixes——

- Removed usage of hacky `.previousElementSibling` and `.nextElementSibling`
- Removed redundant variable `draggingPoint`
- `initialPoints()`: Two virtually identical for-loops, combined
- Concatenated strings -> template strings
