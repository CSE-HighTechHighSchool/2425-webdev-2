document.addEventListener("DOMContentLoaded", function () {
  // Initialize Bootstrap Carousel
  var veniceCarousel = document.getElementById("veniceCarousel");
  var carousel = new bootstrap.Carousel(veniceCarousel, {
    interval: 3000,
    ride: "carousel",
    fade: true,
  });

  // Function to update destination names
  function updateDestinationNames(activeDestination) {
    // Select all destination elements
    var destinations = document.querySelectorAll(".potDestination");

    destinations.forEach(function (destination) {
      if (destination.getAttribute("data-destination") === activeDestination) {
        destination.classList.add("active-destination");
      } else {
        destination.classList.remove("active-destination");
      }
    });
  }

  // Initial update based on the first active slide
  var initialSlide = veniceCarousel.querySelector(".carousel-item.active");
  if (initialSlide) {
    var initialDestination = initialSlide.getAttribute("data-destination");
    updateDestinationNames(initialDestination);
  }

  // Listen to carousel slide event (fires when the transition starts)
  veniceCarousel.addEventListener("slide.bs.carousel", function (event) {
    var activeSlide = event.relatedTarget;
    var activeDestination = activeSlide.getAttribute("data-destination");
    updateDestinationNames(activeDestination);
  });
});
