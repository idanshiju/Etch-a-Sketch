let isMouseDown = false;
let gridSize = 16; // starting grid size
const minGrid = 1; // smallest size
const maxGrid = 640; // largest size
let isEraser = false;
let isPencil = true;
let clear = false;

let knobRotation = 0;

let isLeftRotating = false;
let isRightRotating = false;

let rightKnobRotation = 0;
let currentHue = 0;
let currentColor = `hsla(0, 0%, 100%, 1.00)`; // default color

const container = document.querySelector(".screen");
const leftKnob = document.querySelector(".knob.left");
const eraserBtn = document.getElementById("eraser");
const pencilBtn = document.getElementById("pencil");
pencilBtn.classList.add("active"); // Set pencil as default active tool
const rightKnob = document.querySelector(".knob.right");
const clearBtn = document.getElementById("clear");

rightKnob.style.backgroundColor = currentColor;

// Track mouse button state
document.addEventListener("mousedown", () => (isMouseDown = true));
document.addEventListener("mouseup", () => (isMouseDown = false));

// Clear button
clearBtn.addEventListener("click", () => {
  const boxes = document.querySelectorAll(".cell");
  boxes.forEach((box) => {
    box.style.backgroundColor = "white";
    box.dataset.darkness = 0;
  });
});

// Pencil button
pencilBtn.addEventListener("click", () => {
  isPencil = !isPencil;
  pencilBtn.classList.toggle("active", isPencil);
});

// Eraser button
eraserBtn.addEventListener("click", () => {
  isEraser = !isEraser;
  eraserBtn.classList.toggle("active", isEraser);
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
        handleCellInteraction(box);
      }
    });

    box.addEventListener("mousedown", () => {
      handleCellInteraction(box);
    });

    container.appendChild(box);
  }
}

// Handle cell interaction for drawing or erasing
function handleCellInteraction(box) {
  if (isEraser) {
    box.style.backgroundColor = "white";
    box.dataset.darkness = 0;
  } else {
    if (isPencil) {
      let darkness = parseInt(box.dataset.darkness);
      if (darkness < 10) {
        darkness++;
        box.dataset.darkness = darkness;
        box.style.backgroundColor = `rgba(0, 0, 0, ${darkness * 0.1})`;
      }
    } else {
      box.style.backgroundColor = currentColor;
    }
  }
}

// Knob rotation logic
//Left Knob
leftKnob.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isLeftRotating = true;
});

rightKnob.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isRightRotating = true;
});

document.addEventListener("mouseup", () => {
  isLeftRotating = false;
  isRightRotating = false;
});

document.addEventListener("mousemove", (e) => {
  if (isLeftRotating) {
    knobRotation += e.movementY * -0.5;
    leftKnob.style.transform = `rotate(${knobRotation}deg)`;

    let newSize = Math.round(gridSize + e.movementY * -0.1);
    newSize = Math.max(minGrid, Math.min(maxGrid, newSize));

    if (newSize !== gridSize) {
      gridSize = newSize;
      createGrid(gridSize);
    }
  }

  if (isRightRotating) {
    rightKnobRotation += e.movementY * -0.5;
    rightKnob.style.transform = `rotate(${rightKnobRotation}deg)`;

    currentHue = (currentHue + e.movementY) % 360;
    currentColor = `hsl(${currentHue}, 100%, 50%)`;
    rightKnob.style.backgroundColor = currentColor;
  }

});

rightKnob.addEventListener("dblclick", () => {
  const input = document.createElement("input");
  input.type = "color";
  input.value = currentColor; // ✅ Set initial color
  input.style.position = "absolute";
  input.style.left = `${rightKnob.getBoundingClientRect().left}px`;
  input.style.top = `${rightKnob.getBoundingClientRect().bottom}px`;
  input.style.opacity = "0";
  input.style.pointerEvents = "none";
  document.body.appendChild(input);

  input.addEventListener("change", () => {
    currentColor = input.value;
    rightKnob.style.backgroundColor = currentColor;
    document.body.removeChild(input);
  });

  input.click();
});

createGrid(gridSize);
