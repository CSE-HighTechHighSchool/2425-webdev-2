// dashboard.js

import {
  auth,
  db,
  signInWithEmailAndPassword,
  ref,
  update,
  get,
  onAuthStateChanged,
  signOut,
  remove,
  set,
} from "./firebase.js";

// Elements
const userNameElem = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const profileForm = document.getElementById("profileForm");
const toursTableBody = document.getElementById("toursTableBody");
const addTourBtn = document.getElementById("addTourBtn");
const settingsForm = document.getElementById("settingsForm");
const darkModeToggle = document.getElementById("darkModeToggle");

// Initialize Dashboard
onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchUserData(user.uid);
    fetchUserTours(user.uid);
  } else {
    // Redirect to login if not authenticated
    window.location.href = "login.html";
  }
});

// Fetch and Display User Data
function fetchUserData(uid) {
  const userRef = ref(db, `users/${uid}/accountInfo`);
  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        userNameElem.textContent = `${userData.firstname} ${userData.lastname}`;
        // Populate Profile Form
        document.getElementById("profileFirstName").value = userData.firstname;
        document.getElementById("profileLastName").value = userData.lastname;
        document.getElementById("profileEmail").value = userData.email;
      } else {
        alert("User data not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}

// Update Profile Information
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const uid = auth.currentUser.uid;
  const firstName = document.getElementById("profileFirstName").value.trim();
  const lastName = document.getElementById("profileLastName").value.trim();
  const email = document.getElementById("profileEmail").value.trim();
  const password = document.getElementById("profilePassword").value;

  const updates = {
    firstname: firstName,
    lastname: lastName,
    email: email,
    updated_at: new Date().toISOString(),
  };

  if (password) {
    // Encrypt the new password before updating
    updates.password = encryptPassword(password);
  }

  update(ref(db, `users/${uid}/accountInfo`), updates)
    .then(() => {
      alert("Profile updated successfully.");
      if (password) {
        // Optionally, reauthenticate the user if password changed
      }
      fetchUserData(uid);
    })
    .catch((error) => {
      alert("Error updating profile: " + error.message);
    });
});

// Fetch and Display User Tours
function fetchUserTours(uid) {
  const toursRef = ref(db, `users/${uid}/tours`);
  get(toursRef)
    .then((snapshot) => {
      toursTableBody.innerHTML = ""; // Clear existing tours
      if (snapshot.exists()) {
        const tours = snapshot.val();
        for (const tourId in tours) {
          const tour = tours[tourId];
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${tour.name}</td>
              <td>${new Date(tour.date).toLocaleDateString('en-US', {timeZone: 'UTC'})}</td>
              <td>${tour.status}</td>
              <td>
                <button class="btn btn-sm btn-primary me-2 edit-tour-btn" data-id="${tourId}"><i class="bi bi-pencil"></i> Edit</button>
                <button class="btn btn-sm btn-danger delete-tour-btn" data-id="${tourId}"><i class="bi bi-trash"></i> Delete</button>
              </td>
            `;
          toursTableBody.appendChild(row);
        }
        attachTourButtons();
      } else {
        toursTableBody.innerHTML = `
            <tr>
              <td colspan="4" class="text-center">No tours found. Add a new tour!</td>
            </tr>
          `;
      }
    })
    .catch((error) => {
      console.error("Error fetching tours:", error);
    });
}

// Attach Event Listeners to Tour Buttons
function attachTourButtons() {
  const editButtons = document.querySelectorAll(".edit-tour-btn");
  const deleteButtons = document.querySelectorAll(".delete-tour-btn");

  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const tourId = e.target.getAttribute("data-id");
      editTour(tourId);
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const tourId = e.target.getAttribute("data-id");
      deleteTour(tourId);
    });
  });
}

// Add New Tour
addTourBtn.addEventListener("click", () => {
  // You can implement a modal form for adding a new tour
  const tourName = prompt("Enter Tour Name:");
  const tourDate = prompt("Enter Tour Date (YYYY-MM-DD):");

  if (tourName && tourDate) {
    const uid = auth.currentUser.uid;
    const toursRef = ref(db, `users/${uid}/tours`);
    const newTourRef = ref(db, `users/${uid}/tours/${generateUniqueId()}`);

    set(newTourRef, {
      name: tourName,
      date: tourDate,
      status: "Upcoming",
      created_at: new Date().toISOString(),
    })
      .then(() => {
        alert("New tour added successfully.");
        fetchUserTours(uid);
      })
      .catch((error) => {
        alert("Error adding tour: " + error.message);
      });
  } else {
    alert("Tour name and date are required.");
  }
});

// Edit Tour
function editTour(tourId) {
  const newName = prompt("Enter new Tour Name:");
  const newDate = prompt("Enter new Tour Date (YYYY-MM-DD):");
  const newStatus = prompt("Enter Tour Status (Upcoming/Completed):");

  if (newName && newDate && newStatus) {
    const uid = auth.currentUser.uid;
    const tourRef = ref(db, `users/${uid}/tours/${tourId}`);

    update(tourRef, {
      name: newName,
      date: newDate,
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
      .then(() => {
        alert("Tour updated successfully.");
        fetchUserTours(uid);
      })
      .catch((error) => {
        alert("Error updating tour: " + error.message);
      });
  } else {
    alert("All fields are required to update the tour.");
  }
}

// Delete Tour
function deleteTour(tourId) {
  if (confirm("Are you sure you want to delete this tour?")) {
    const uid = auth.currentUser.uid;
    const tourRef = ref(db, `users/${uid}/tours/${tourId}`);

    remove(tourRef)
      .then(() => {
        alert("Tour deleted successfully.");
        fetchUserTours(uid);
      })
      .catch((error) => {
        alert("Error deleting tour: " + error.message);
      });
  }
}

// Generate Unique ID for Tours
function generateUniqueId() {
  return "tour_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

// Handle Settings Form Submission
settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const uid = auth.currentUser.uid;
  const notificationPref = document.getElementById("notificationSettings").value;
  const darkMode = darkModeToggle.checked;

  const updates = {
    notification_preferences: notificationPref,
    dark_mode: darkMode,
    updated_at: new Date().toISOString(),
  };

  update(ref(db, `users/${uid}/settings`), updates)
    .then(() => {
      alert("Settings updated successfully.");
      applySettings(updates);
    })
    .catch((error) => {
      alert("Error updating settings: " + error.message);
    });
});

// Apply Settings (e.g., Dark Mode)
function applySettings(settings) {
  if (settings.dark_mode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

// Fetch and Apply User Settings on Load
function fetchUserSettings(uid) {
  const settingsRef = ref(db, `users/${uid}/settings`);
  get(settingsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const settings = snapshot.val();
        document.getElementById("notificationSettings").value =
          settings.notification_preferences || "all";
        darkModeToggle.checked = settings.dark_mode || false;
        applySettings(settings);
      }
    })
    .catch((error) => {
      console.error("Error fetching settings:", error);
    });
}

// Logout Functionality
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // Redirect to login page after logout
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert("Error logging out: " + error.message);
    });
});

// Initialize Dashboard Settings
onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchUserSettings(user.uid);
  }
});

// Function to Encrypt Password (if updating)
function encryptPassword(password) {
  return CryptoJS.AES.encrypt(password, password).toString();
}
