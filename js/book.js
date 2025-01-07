import { auth, db, signInWithEmailAndPassword, ref, update, get } from "./firebase.js";

// Booking steps configuration
const bookingSteps = [
    {
        title: "Step 1 of 4",
        items: [
            "Choose your preferred tour date and time",
            "Select the number of participants",
            "Review availability for your selected date",
            "Confirm your initial booking preferences"
        ]
    },
    {
        title: "Step 2 of 4",
        items: [
            "Select your tour package type",
            "Choose your must-see locations",
            "Review included attractions",
            "Confirm tour duration"
        ]
    },
    {
        title: "Step 3 of 4",
        items: [
            "Review your booking details",
      })
        .then(() => {
          alert("Tour successfully added!");
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
};

document.getElementById("getButton").onclick = function () {
  const date = document.getElementById("getDate").value.trim();
  const userRef = ref(db, "users/" + user.uid + "/tours/" + date);

  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        addHeader("getTable");
        getTour(snapshot.val(), "getTable");
      } else {
        alert("User data not found.");
      }
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
};

document.getElementById("listButton").onclick = function () {
  const userRef = ref(db, "users/" + user.uid + "/tours");

  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        addHeader("getList");
        snapshot.forEach((child) => {
          addTour(child, "getList");
        });
      } else {
        alert("User data not found.");
      }
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
};

document.getElementById("removeButton").onclick = function () {
  const date = document.getElementById("removeDate").value.trim();
  const userRef = ref(db, "users/" + user.uid + "/tours/" + date);
  remove(userRef)
    .then(() => {
      alert("Tour removed successfully.");
    })
    .catch((error) => {
      alert("Error: " + error);
    });
};

function addTour(value, table) {
  //add rows dynamically to id="table"
  let row = document.createElement("tr");
  row.innerHTML = ``;
  snapshot.forEach((child) => {
    row.innerHTML = row.innerHTML + `<td>${child}</td>\n`;
  });
  document.getElementById(table).appendChild(row);
}

function addHeader(table) {
  //add header row to id="table"
  const row = document.createElement("tr");
  row.innerHTML =
    `<td>Date</td>
    <td>Max Group Size</td>
    <td>VIP</td>
    <td>Number of Sites</td>
    <td>First Choice Site</td>
    <td>Second Choice Site</td>
    <td>Third Choice Site</td>`
  document.getElementById(table).appendChild(row);
}

let myCarousel;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the carousel
    myCarousel = new bootstrap.Carousel(document.getElementById('bookingCarousel'), {
        interval: false,
        keyboard: false,
        wrap: false,
        touch: false
    });
});

// Make functions available globally
window.nextSlide = function() {
    myCarousel.next();
};

window.submitBooking = function() {
    alert('Booking completed successfully!');
};
