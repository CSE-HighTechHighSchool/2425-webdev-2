// Scroll-Based Animations using Intersection Observer
document.addEventListener("DOMContentLoaded", function () {
  // Select all elements with the class 'animate-on-scroll'
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  // Options for the Intersection Observer
  const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: "0px 0px -50px 0px", // Margin around the root
  };

  // Create a new Intersection Observer
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // Check if the element is intersecting
      if (entry.isIntersecting) {
        // Add the 'visible' class to the element
        entry.target.classList.add("visible");
        // Stop observing the element
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe each animated element
  animatedElements.forEach((el) => {
    observer.observe(el);
  });
});
