# 2022-09-01

- Prettier, if you haven't noticed already

—— Behaviour Changes ——

- Added labels for animation speed and t value
- Added a slider for t value

—— Design Updates ——

- Sliders and checkboxes are now not using the native browser design anymore. Checkboxes especially look beautiful :heart_eyes:
- The t value in the bottom left (speedometer) now only shows when the controls are minimized
-

—— Code Optimization ——

- Removed usage of hacky .previousElementSibling and .nextElementSibling
- Removed redundant variable draggingPoint
- initialPoints(): Two virtually identical for-loops, combined
- Concatenated strings -> template strings
