document.addEventListener("DOMContentLoaded", function () {
  // Select all potDestination elements and the showcase div
  const destinations = document.querySelectorAll(".potDestination");
  const showcase = document.querySelector(".showcase");

  // Array of background images for each destination
  const backgroundImages = [
    "url('index-imgs/first-img.png')", // Piazza San Marco
    "url('/Users/niyel/Projects/2425-webdev-2/index-imgs/gondola-tour.jpg')", // Saint Mark's Basilica
    "url('index-imgs/logo.png')", // Ponte de Rialto
    "url('https://placehold.co/300')", // Rialto Market
    "url('path/to/doge-palace.jpg')", // Doge's Palace
    "url('path/to/grand-canal.jpg')", // Grand Canal
  ];

  let currentIndex = 0;
  let interval;

  // Function to change the background image and underline the active destination
  function changeBackgroundByIndex(index) {
    // Remove active class from all destinations
    destinations.forEach((dest) => dest.classList.remove("active"));

    // Add active class to the current destination
    destinations[index].classList.add("active");

    // Change the showcase background image
    showcase.style.backgroundImage = backgroundImages[index];
  }

  // Auto-cycle through the destinations every 2 seconds
  function startAutoCycle() {
    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % destinations.length;
      changeBackgroundByIndex(currentIndex);
    }, 2000);
  }

  // Add click event listeners to each destination for manual control
  destinations.forEach((destination, index) => {
    destination.addEventListener("click", function () {
      clearInterval(interval); // Stop auto-cycling when clicked
      changeBackgroundByIndex(index); // Show clicked background
    });
  });

  // Start the auto cycle
  startAutoCycle();
});
