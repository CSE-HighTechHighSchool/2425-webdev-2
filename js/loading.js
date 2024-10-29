document.addEventListener("DOMContentLoaded", function () {
  // Select the loading screen, main content, and water elements
  const loadingScreen = document.querySelector(".loading-screen");
  const mainContent = document.querySelector(".main-content");
  const water = document.querySelector(".water");

  // Add an event listener for the end of the water animation
  water.addEventListener("animationend", function () {
    // After the animation ends, wait for 500ms
    setTimeout(() => {
      // Fade out the loading screen
      loadingScreen.style.opacity = "0";
      // After the fade-out transition, wait for another 500ms
      setTimeout(() => {
        // Hide the loading screen and show the main content
        loadingScreen.style.display = "none";
        mainContent.style.display = "block";
        // Apply a fade-in animation to the main content
        mainContent.style.animation = "fadeIn 1s ease-out forwards";
      }, 500);
    }, 500);
  });
});
