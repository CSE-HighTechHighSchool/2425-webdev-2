// Navbar background change on scroll
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Initialize Carousel
var testimonialCarousel = document.querySelector("#testimonialCarousel");
var carousel = new bootstrap.Carousel(testimonialCarousel, {
  interval: 5000,
  ride: "carousel",
  wrap: true,
});

// Smooth scrolling for navigation links
document.querySelectorAll("a.nav-link").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    if (this.hash !== "") {
      e.preventDefault();
      const hash = this.hash;
      document.querySelector(hash).scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const loadingScreen = document.querySelector(".loading-screen");
  const mainContent = document.querySelector(".main-content");
  const water = document.querySelector(".water");

  water.addEventListener("animationend", function () {
    setTimeout(() => {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
        mainContent.style.display = "block";
        mainContent.style.animation = "fadeIn 1s ease-out forwards";
      }, 500);
    }, 500);
  });
});
