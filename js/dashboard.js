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

// **Removed Elements Not Present in HTML**
// const userNameElem = document.getElementById("userName");
// const logoutBtn = document.getElementById("logoutBtn");

// **Retained Elements**
const profileForm = document.getElementById("profileForm");
const toursTableBody = document.getElementById("toursTableBody");
const removeTourBtn = document.getElementById("removeTourBtn");
const addTourBtn = document.getElementById("addTourBtn");
const settingsForm = document.getElementById("settingsForm");
const darkModeToggle = document.getElementById("darkModeToggle");

// **Session Storage Handling for Tour Booking**
if (sessionStorage.getItem("tourPressed")) {
  switchTab("bookTour");
  sessionStorage.setItem("tourPressed", false);
  // if tour preferences are loaded (premade tour), auto-populate the boxes in the Book Tour page
  const tourCustomization = sessionStorage.getItem("tourCustomization");
  if (tourCustomization) {
    try {
      let tourData = JSON.parse(tourCustomization);
      document.getElementById("tourLength").value = tourData[0];
      document.getElementById("groupSize").value = tourData[1];
      document.getElementById("vipTour").value = tourData[2];
      document.getElementById("numSites").value = tourData[3];
      document.getElementById("firstSite").value = tourData[4];
      document.getElementById("secondSite").value = tourData[5];
      document.getElementById("thirdSite").value = tourData[6];
    } catch (error) {
      console.error("Error parsing tourCustomization from sessionStorage:", error);
    }
  }
}

// **Add Tab Switching Functionality**
function setupTabNavigation() {
  const navLinks = document.querySelectorAll(".nav-link[data-tab]");
  const sections = document.querySelectorAll(".dashboard-section");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      link.classList.add("active");

      // Hide all sections
      sections.forEach((section) => section.classList.add("d-none"));

      // Show selected section
      const targetTab = link.getAttribute("data-tab");
      const targetSection = document.getElementById(targetTab);
      if (targetSection) {
        targetSection.classList.remove("d-none");
      }
    });
  });
}

// **Function to Handle Tab Switching**
function switchTab(tabId) {
  // Only hide/show sections if we're on a larger screen
  if (window.innerWidth > 992) {
    // Hide all dashboard sections
    document.querySelectorAll(".dashboard-section").forEach((section) => {
      section.classList.add("d-none");
    });

    // Show selected section
    const targetSection = document.getElementById(tabId);
    if (targetSection) {
      targetSection.classList.remove("d-none");
    }
  }

  // Always update active state of nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });
  const activeLink = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
  if (activeLink) activeLink.classList.add("active");

  // Scroll handling
  if (window.innerWidth <= 992) {
    // Scroll to the section on mobile
    const targetSection = document.getElementById(tabId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  } else {
    // Scroll to top on desktop
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}

// **Initialize Dashboard**
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    fetchUserData(user.uid);
    fetchUserTours(user.uid);
    fetchUserSettings(user.uid);
    setupTabNavigation();
  } else {
    // User is signed out
    // Redirect to login if trying to access dashboard
    window.location.href = "login.html";
  }
});

// **Fetch and Display User Data**
function fetchUserData(uid) {
  const userRef = ref(db, `users/${uid}/accountInfo`);
  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        // **Removed userNameElem.textContent assignment**
        // userNameElem.textContent = `${userData.firstname} ${userData.lastname}`;

        // Populate Profile Form
        const profileFirstName = document.getElementById("profileFirstName");
        const profileLastName = document.getElementById("profileLastName");
        const profileEmail = document.getElementById("profileEmail");

        if (profileFirstName) profileFirstName.value = userData.firstname || "";
        if (profileLastName) profileLastName.value = userData.lastname || "";
        if (profileEmail) profileEmail.value = userData.email || "";
      } else {
        alert("User data not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}

// **Update Profile Information**
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

// **Fetch and Display User Tours**
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
              <td>${tour.name || "Unnamed Tour"}</td>
              <td>${
                tour.tourDate
                  ? new Date(tour.tourDate).toLocaleDateString("en-US", { timeZone: "UTC" })
                  : "No Date"
              }</td>
              <td>${tour.status || "Unknown"}</td>
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

// **Attach Event Listeners to Tour Buttons**
function attachTourButtons() {
  // Edit Tour Buttons
  document.querySelectorAll(".edit-tour-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const tourId = e.currentTarget.getAttribute("data-id");
      // Implement tour editing functionality here
      alert(`Edit tour with ID: ${tourId}`);
    });
  });

  // Delete Tour Buttons
  document.querySelectorAll(".delete-tour-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const tourId = e.currentTarget.getAttribute("data-id");
      const confirmation = confirm("Are you sure you want to delete this tour?");
      if (confirmation) {
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
    });
  });
}

// **Add New Tour**
// Redirect to Book Tour page if button is pressed
addTourBtn.addEventListener("click", () => {
  switchTab("bookTour");
});

// **Remove Tour**
removeTourBtn.addEventListener("click", () => {
  // pop-up window to prompt date of removed tour
  const date = prompt("Enter the date of the tour you would like to remove (YYYY-MM-DD): ");
  if (!date) {
    alert("No date entered.");
    return;
  }

  const uid = auth.currentUser.uid;
  const tourRef = ref(db, `users/${uid}/tours/${date}`);

  // get tour at reference and remove
  get(tourRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        remove(tourRef)
          .then(() => {
            alert("Tour removed successfully.");
            fetchUserTours(uid);
          })
          .catch((error) => {
            alert("Error removing tour: " + error.message);
          });
      } else {
        alert("No tour found for the entered date.");
      }
    })
    .catch((error) => {
      console.error("Error fetching tour:", error);
    });
});

// **Handle Settings Form Submission**
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

// **Apply Settings (e.g., Dark Mode)**
function applySettings(settings) {
  if (settings.dark_mode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

// **Fetch and Apply User Settings on Load**
function fetchUserSettings(uid) {
  const settingsRef = ref(db, `users/${uid}/settings`);
  get(settingsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const settings = snapshot.val();
        const notificationSettings = document.getElementById("notificationSettings");
        if (notificationSettings) {
          notificationSettings.value = settings.notification_preferences || "all";
        }
        if (darkModeToggle) {
          darkModeToggle.checked = settings.dark_mode || false;
        }
        applySettings(settings);
      }
    })
    .catch((error) => {
      console.error("Error fetching settings:", error);
    });
}

// **Function to Encrypt Password (if updating)**
function encryptPassword(password) {
  // **Note:** Using the password as the encryption key is insecure.
  // Consider using a more secure key management strategy.
  return CryptoJS.AES.encrypt(password, "your-secure-secret-key").toString();
}

// **Book Tour Functionality**
window.saveTourBooking = function () {
  const tourData = {
    name: `Tour on ${document.getElementById("tourDate").value}`,
    tourLength: document.getElementById("tourLength").value,
    groupSize: document.getElementById("groupSize").value,
    vipTour: document.getElementById("vipTour").value,
    numSites: document.getElementById("numSites").value,
    firstSite: document.getElementById("firstSite").value,
    secondSite: document.getElementById("secondSite").value,
    thirdSite: document.getElementById("thirdSite").value,
    tourDate: document.getElementById("tourDate").value,
    notes: document.getElementById("tourNotes").value,
    status: "Upcoming",
    created_at: new Date().toISOString(),
  };

  // Validate required fields
  if (!tourData.tourLength || !tourData.groupSize || !tourData.tourDate) {
    alert("Please fill in all required fields.");
    return;
  }

  const uid = auth.currentUser.uid;
  const tourId = tourData.tourDate; // Using tourDate as the unique ID
  const tourRef = ref(db, `users/${uid}/tours/${tourId}`);

  set(tourRef, tourData)
    .then(() => {
      // Data was successfully written to Firebase
      document.getElementById("tourOverviewForm").reset();
      document.getElementById("tourSitesForm").reset();
      document.getElementById("tourDateNotesForm").reset();

      // Show the confirmation modal
      const modal = new bootstrap.Modal(document.getElementById("bookingConfirmationModal"));
      modal.show();

      // Refresh tours list
      fetchUserTours(uid);
    })
    .catch((error) => {
      alert("Error booking tour: " + error.message);
    });
};

// **Function to View My Tours Section**
window.viewMyTours = function () {
  // Hide modal
  const modal = bootstrap.Modal.getInstance(document.getElementById("bookingConfirmationModal"));
  modal.hide();

  // Switch to My Tours tab
  switchTab("myTours");
};

// **Initialize User Settings on Auth State Change**
onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchUserSettings(user.uid);
  }
});
