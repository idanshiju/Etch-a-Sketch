document.addEventListener("DOMContentLoaded", () => {
  const helpPanel = document.querySelector(".help-desk");
  const helpToggle = document.getElementById("help-toggle");

  helpToggle.addEventListener("click", () => {
    helpPanel.classList.toggle("collapsed");
    helpToggle.textContent = helpPanel.classList.contains("collapsed") ? "❔" : "✖";
  });
});
