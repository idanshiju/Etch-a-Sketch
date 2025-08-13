let isMouseDown = false;
let gridSize = 16; // starting grid size
const minGrid = 1;
const maxGrid = 640;
let isEraser = false;
let isPencil = true;
let clear = false;

let knobRotation = 0;
let isLeftRotating = false;
let isRightRotating = false;

let rightKnobRotation = 0;
let currentHue = 0;
let currentColor = `#ffffff`; // default color in HEX

const container = document.querySelector(".screen");
const leftKnob = document.querySelector(".knob.left");
const eraserBtn = document.getElementById("eraser");
const pencilBtn = document.getElementById("pencil");
pencilBtn.classList.add("active");
const rightKnob = document.querySelector(".knob.right");
const clearBtn = document.getElementById("clear");

rightKnob.style.backgroundColor = currentColor;

// Mouse tracking
document.addEventListener("mousedown", () => (isMouseDown = true));
document.addEventListener("mouseup", () => (isMouseDown = false));

// Clear button
clearBtn.addEventListener("click", () => {
  document.querySelectorAll(".cell").forEach((box) => {
    box.style.backgroundColor = "white";
    box.dataset.darkness = 0;
  });
});

// Pencil button (mutually exclusive with eraser)
pencilBtn.addEventListener("click", () => {
  isPencil = !isPencil;
  pencilBtn.classList.toggle("active", isPencil);
});

// Eraser button (mutually exclusive with pencil)
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
      if (isMouseDown) handleCellInteraction(box);
    });

    box.addEventListener("mousedown", () => {
      handleCellInteraction(box);
    });

    container.appendChild(box);
  }
}

// Handle drawing/erasing
function handleCellInteraction(box) {
  if (isEraser) {
    box.style.backgroundColor = "white";
    box.dataset.darkness = 0;
  } else if (isPencil) {
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

// Knob controls
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

// Debounce helper
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

const updateGridSize = debounce((newSize) => {
  gridSize = newSize;
  createGrid(gridSize);
}, 50);

document.addEventListener("mousemove", (e) => {
  if (isLeftRotating) {
    knobRotation += e.movementY * -0.5;
    leftKnob.style.transform = `rotate(${knobRotation}deg)`;

    let newSize = Math.round(gridSize + e.movementY * -0.1);
    newSize = Math.max(minGrid, Math.min(maxGrid, newSize));

    if (newSize !== gridSize) {
      updateGridSize(newSize);
    }
  }

  if (isRightRotating) {
    rightKnobRotation += e.movementY * -0.5;
    rightKnob.style.transform = `rotate(${rightKnobRotation}deg)`;

    currentHue = (currentHue + e.movementY) % 360;
    currentColor = hslToHex(currentHue, 100, 50);
    rightKnob.style.backgroundColor = currentColor;
  }
});

// Right knob color picker
rightKnob.addEventListener("dblclick", () => {
  const input = document.createElement("input");
  input.type = "color";
  input.value = currentColor; // hex value
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

// Helper: Convert HSL to HEX for input color compatibility
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

createGrid(gridSize);
