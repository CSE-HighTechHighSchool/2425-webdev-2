// ...existing code...
document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("myChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "St. Mark's Basilica",
        "Rialto Bridge",
        "Grand Canal",
        "Doge's Palace",
        "Peggy Guggenheim",
      ],
      datasets: [
        {
          data: [2500, 1800, 3000, 1200, 2200],
          backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
          borderRadius: 20,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Number of Visitors",
            font: {
              size: 16,
              weight: "bold",
            },
            color: "#333",
          },
          ticks: {
            color: "#555",
          },
        },
        x: {
          title: {
            display: true,
            text: "Locations",
            font: {
              size: 16,
              weight: "bold",
            },
            color: "#333",
          },
          ticks: {
            color: "#555",
          },
        },
      },
    },
  });

  // Animate stats numbers on scroll
  const statsSection = document.getElementById("stats");
  const counters = document.querySelectorAll(".stat-number");
  const speed = 2000; // Duration in milliseconds

  const animateCounters = () => {
    counters.forEach((counter) => {
      const updateCount = () => {
        const target = +counter.getAttribute("data-number");
        const suffix = counter.getAttribute("data-suffix") || "";
        const current = +counter.innerText.replace(/[^\d]/g, "");
        const increment = target / (speed / 50);

        if (current < target) {
          counter.innerText = Math.ceil(current + increment) + suffix;
          setTimeout(updateCount, 50);
        } else {
          counter.innerText = target + suffix;
        }
      };
      updateCount();
    });
  };

  const observerOptions = {
    root: null,
    threshold: 0.7,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(statsSection);
});
