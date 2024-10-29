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
