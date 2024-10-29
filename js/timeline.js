// Scroll-Based Animations
document.addEventListener("DOMContentLoaded", function () {
  const timelineHeading = document.querySelector(".timeline h2");
  const timelineItems = document.querySelectorAll(".timeline .timeline-item");
  const factsSection = document.querySelector(".facts");
  const footerSection = document.querySelector("footer");

  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Animate Timeline Heading
        if (entry.target === timelineHeading) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }

        // Animate Timeline Items
        if (entry.target.classList.contains("timeline-item")) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }

        // Animate Facts Section
        if (entry.target === factsSection) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }

        // Animate Footer
        if (entry.target === footerSection) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }
    });
  }, observerOptions);

  // Observe Timeline Heading
  if (timelineHeading) {
    observer.observe(timelineHeading);
  }

  // Observe each Timeline Item
  timelineItems.forEach((item) => {
    observer.observe(item);
  });

  // Observe Facts Section
  if (factsSection) {
    observer.observe(factsSection);
  }

  // Observe Footer
  if (footerSection) {
    observer.observe(footerSection);
  }
});
