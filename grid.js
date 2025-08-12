let isMouseDown = false;
// Track mouse button state
document.addEventListener("mousedown", () => (isMouseDown = true));
document.addEventListener("mouseup", () => (isMouseDown = false));

// Clear button functionality
const clearBtn = document.getElementById("reset");
clearBtn.addEventListener("click", () => {
  const boxes = document.querySelectorAll(".square");
  boxes.forEach((box) => {
    box.style.backgroundColor = "white"; // Reset background
    box.dataset.darkness = 0; // Reset darkness level
  });
});

const container = document.querySelector(".screen");

function createGrid(n) {
  container.innerHTML = ""; // Clear old grid

  for (let i = 0; i < n * n; i++) {
    const box = document.createElement("div");
    box.classList.add("square");
    box.style.flex = `0 0 ${100 / n}%`;
    container.appendChild(box);

    // Store darkness level (0 = white)
    box.dataset.darkness = 0;

    // Darken only when mouse is pressed and moving over the box
    box.addEventListener("mouseover", () => {
      if (isMouseDown) {
        let darkness = parseInt(box.dataset.darkness);
        if (darkness < 10) {
          darkness++;
          box.dataset.darkness = darkness;
          box.style.backgroundColor = `rgba(0, 0, 0, ${darkness * 0.1})`;
        }
      }
    });

    // Also allow single-click shading
    box.addEventListener("mousedown", () => {
      let darkness = parseInt(box.dataset.darkness);
      if (darkness < 10) {
        darkness++;
        box.dataset.darkness = darkness;
        box.style.backgroundColor = `rgba(0, 0, 0, ${darkness * 0.1})`;
      }
    });
  }
}

createGrid(160);
