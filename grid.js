let isMouseDown = false;
let gridSize = 16; // starting grid size
const minGrid = 1; // smallest size
const maxGrid = 640; // largest size
let isEraser = false;
let clear = false;

let knobRotation = 0;
let isRotating = false;

const container = document.querySelector(".screen");
const leftKnob = document.querySelector(".knob.left");
const eraserBtn = document.getElementById("eraser");
const rightKnob = document.querySelector(".knob.right");
const clearBtn = document.getElementById("clear");

// Track mouse button state
document.addEventListener("mousedown", () => (isMouseDown = true));
document.addEventListener("mouseup", () => (isMouseDown = false));

// Reset button
clearBtn.addEventListener("click", () => {
  const boxes = document.querySelectorAll(".cell");
  boxes.forEach((box) => {
    box.style.backgroundColor = "white";
    box.dataset.darkness = 0;
  });
});

// Create grid
function createGrid(n) {
  container.innerHTML = "";

  for (let i = 0; i < n * n; i++) {
    const box = document.createElement("div");
    box.classList.add("cell");
    box.style.flex = `0 0 ${100 / n}%`;
    box.dataset.darkness = 0;

    box.addEventListener("mouseover", () => {
      if (isMouseDown) {
        darken(box);
      }
    });

    box.addEventListener("mousedown", () => {
      darken(box);
    });

    container.appendChild(box);
  }
}

function darken(box) {
  let darkness = parseInt(box.dataset.darkness);
  if (darkness < 10) {
    darkness++;
    box.dataset.darkness = darkness;
    box.style.backgroundColor = `rgba(0, 0, 0, ${darkness * 0.1})`;
  }
}

// Knob rotation logic
leftKnob.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isRotating = true;
});

document.addEventListener("mouseup", () => {
  isRotating = false;
});

document.addEventListener("mousemove", (e) => {
  if (!isRotating) return;

  // Determine rotation based on mouse movement
  knobRotation += e.movementY * -0.5; // drag up = clockwise, down = anticlockwise
  leftKnob.style.transform = `rotate(${knobRotation}deg)`;

  // Adjust grid size proportionally
  let newSize = Math.round(gridSize + e.movementY * -0.1);
  newSize = Math.max(minGrid, Math.min(maxGrid, newSize));

  if (newSize !== gridSize) {
    gridSize = newSize;
    createGrid(gridSize);
  }
});

createGrid(gridSize);
