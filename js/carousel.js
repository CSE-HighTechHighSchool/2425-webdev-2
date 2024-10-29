// Initialize Carousel

// Select the carousel element by its ID
var testimonialCarousel = document.querySelector("#testimonialCarousel");

// Create a new Bootstrap carousel instance with the selected element
var carousel = new bootstrap.Carousel(testimonialCarousel, {
  interval: 5000, // Set the interval to 5000 milliseconds (5 seconds)
  ride: "carousel", // Enable automatic cycling of the carousel
  wrap: true, // Allow the carousel to cycle continuously (wrap around)
});
