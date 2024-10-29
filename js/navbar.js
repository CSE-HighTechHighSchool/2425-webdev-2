// Add an event listener for the scroll event on the window object
window.addEventListener("scroll", function () {
  // Select the navbar element
  const navbar = document.querySelector(".navbar");
  // Select the navbar toggle button element
  const navToggle = document.querySelector(".navbar-toggler");

  // Check if the page has been scrolled more than 50 pixels vertically
  if (window.scrollY > 50) {
    // Add the "scrolled" class to the navbar and toggle button if scrolled more than 50 pixels
    navbar.classList.add("scrolled");
    navToggle.classList.add("scrolled");
  } else {
    // Remove the "scrolled" class from the navbar and toggle button if scrolled less than 50 pixels
    navbar.classList.remove("scrolled");
    navToggle.classList.remove("scrolled");
  }
});
