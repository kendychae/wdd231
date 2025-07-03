const menuBtn = document.querySelector("#menuBtn");
const navMenu = document.querySelector("#navMenu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  const isOpen = navMenu.classList.contains("open");
  menuBtn.setAttribute("aria-pressed", isOpen);
});
