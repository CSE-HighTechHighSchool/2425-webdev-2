window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  const navToggle = document.querySelector(".navbar-toggler");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
    navToggle.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
    navToggle.classList.remove("scrolled");
  }
});
