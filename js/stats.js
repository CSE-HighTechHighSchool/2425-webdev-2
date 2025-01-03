import { db, ref, get } from "./firebase.js";

document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("myChart").getContext("2d");

  // Fetch labels and data from Firebase
  get(ref(db, "stats/chartData"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const chartData = snapshot.val();

        new Chart(ctx, {
          type: "bar",
          data: {
            labels: chartData.labels,
            datasets: [
              {
                data: chartData.data,
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
      } else {
        console.log("No chart data available.");
      }
    })
    .catch((error) => {
      console.error("Error fetching chart data:", error);
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
