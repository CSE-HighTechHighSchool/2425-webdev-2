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
  onValue,
} from "./firebase.js";

// **Retained Elements**
const profileForm = document.getElementById("profileForm");
const toursTableBody = document.getElementById("toursTableBody");
const removeTourBtn = document.getElementById("removeTourBtn");
const addTourBtn = document.getElementById("addTourBtn");
const settingsForm = document.getElementById("settingsForm");

// New Elements for Profile Picture and Name
const sidebarProfilePic = document.getElementById("sidebarProfilePic");
const sidebarUserName = document.getElementById("sidebarUserName");
const currentProfilePic = document.getElementById("currentProfilePic");
const profilePictureInput = document.getElementById("profilePicture");
const changeProfilePicBtn = document.getElementById("changeProfilePicBtn");
const imageError = document.getElementById("imageError"); // Error Message Container

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
    listenToProfileChanges(user.uid); // Listen for real-time profile updates
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

        // Display user's name in the sidebar
        sidebarUserName.textContent = `${userData.firstname} ${userData.lastname}`;

        // Display user's profile picture in the sidebar
        if (userData.profilePicture) {
          sidebarProfilePic.src = userData.profilePicture;
        } else {
          sidebarProfilePic.src = "https://via.placeholder.com/100";
        }

        // Populate Profile Form
        const profileFirstName = document.getElementById("profileFirstName");
        const profileLastName = document.getElementById("profileLastName");
        const profileEmail = document.getElementById("profileEmail");
        const currentProfilePicElem = document.getElementById("currentProfilePic");

        if (profileFirstName) profileFirstName.value = userData.firstname || "";
        if (profileLastName) profileLastName.value = userData.lastname || "";
        if (profileEmail) profileEmail.value = userData.email || "";
        if (currentProfilePicElem && userData.profilePicture) {
          currentProfilePicElem.src = userData.profilePicture;
        }
      } else {
        alert("User data not found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}

// **Listen for Real-Time Profile Changes**
function listenToProfileChanges(uid) {
  const profileRef = ref(db, `users/${uid}/accountInfo`);
  onValue(profileRef, (snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();

      // Update sidebar user name
      sidebarUserName.textContent = `${userData.firstname} ${userData.lastname}`;

      // Update sidebar profile picture
      if (userData.profilePicture) {
        sidebarProfilePic.src = userData.profilePicture;
      } else {
        sidebarProfilePic.src = "https://via.placeholder.com/100";
      }

      // Update current profile picture in profile form
      if (currentProfilePic) {
        currentProfilePic.src = userData.profilePicture || "https://via.placeholder.com/150";
      }
    }
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
  const profilePicFile = profilePictureInput.files[0];

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

  // Handle profile picture upload if a new file is selected
  if (profilePicFile) {
    // Clear any existing error messages
    imageError.textContent = "";

    // Check if the file size exceeds 500KB
    if (profilePicFile.size > 512000) {
      // 500KB = 500 * 1024 bytes = 512000 bytes
      imageError.textContent = "Image size exceeds 500KB. Please choose a smaller file.";
      // Reset the file input and preview image
      profilePictureInput.value = "";
      currentProfilePic.src = "https://via.placeholder.com/150";
      return; // Prevent further execution
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const base64String = event.target.result;
      updates.profilePicture = base64String;

      // Update the database with the new profile picture and other info
      update(ref(db, `users/${uid}/accountInfo`), updates)
        .then(() => {
          alert("Profile updated successfully.");
          if (password) {
            // Optionally, reauthenticate the user if password changed
          }
          fetchUserData(uid);
          // Reset the file input
          profilePictureInput.value = "";
        })
        .catch((error) => {
          alert("Error updating profile: " + error.message);
        });
    };
    reader.readAsDataURL(profilePicFile);
  } else {
    // Update the database without changing the profile picture
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
  }
});

// **Handle Profile Picture Preview via Change Image Button**
changeProfilePicBtn.addEventListener("click", () => {
  profilePictureInput.click();
});

// **Handle Profile Picture Preview on File Selection**
profilePictureInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    // Clear any existing error messages
    imageError.textContent = "";

    // Check if the file size exceeds 500KB
    if (file.size > 512000) {
      // 500KB = 500 * 1024 bytes = 512000 bytes
      imageError.textContent = "Image size exceeds 500KB. Please choose a smaller file.";
      // Reset the file input and preview image
      profilePictureInput.value = "";
      currentProfilePic.src = "https://via.placeholder.com/150";
      return; // Prevent further execution
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      currentProfilePic.src = event.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    // If no file is selected, reset the preview image
    currentProfilePic.src = "https://via.placeholder.com/150";
    imageError.textContent = "";
  }
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

  // Notification Preferences
  const notifyEmail = document.getElementById("notifyEmail").checked;
  const notifySMS = document.getElementById("notifySMS").checked;
  const notifyPush = document.getElementById("notifyPush").checked;

  // Privacy Settings
  const privacyOptions = document.getElementsByName("privacyOptions");
  let privacySetting = "public"; // default
  privacyOptions.forEach((option) => {
    if (option.checked) {
      privacySetting = option.value;
    }
  });

  // Language Preferences
  const languagePref = document.getElementById("languageSettings").value;

  // Email Visibility
  const emailVisibilityOptions = document.getElementsByName("emailVisibility");
  let emailVisibility = "show"; // default
  emailVisibilityOptions.forEach((option) => {
    if (option.checked) {
      emailVisibility = option.value;
    }
  });

  const updates = {
    notification_preferences: {
      email: notifyEmail,
      sms: notifySMS,
      push: notifyPush,
    },
    privacy_settings: privacySetting,
    language_preferences: languagePref,
    email_visibility: emailVisibility,
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

// **Apply Settings (e.g., Language, Privacy, Email Visibility)**
function applySettings(settings) {
  // Apply Notification Preferences
  if (settings.notification_preferences) {
    console.log("Notification Preferences:", settings.notification_preferences);
    // Implement notification preferences functionality here
  }

  // Apply Privacy Settings
  if (settings.privacy_settings) {
    console.log("Privacy Settings:", settings.privacy_settings);
    // Implement privacy settings functionality here
  }

  // Apply Language Preferences
  if (settings.language_preferences) {
    console.log(`Language set to: ${settings.language_preferences}`);
    // Implement language change functionality here
    // Example: Reload page or integrate with a localization library
  }

  // Apply Email Visibility
  if (settings.email_visibility) {
    console.log(`Email Visibility: ${settings.email_visibility}`);
    // Implement email visibility functionality here
    // Example: Hide or show email on the user's profile
  }
}

// **Fetch and Apply User Settings on Load**
function fetchUserSettings(uid) {
  const settingsRef = ref(db, `users/${uid}/settings`);
  get(settingsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const settings = snapshot.val();

        // Notification Preferences
        if (settings.notification_preferences) {
          document.getElementById("notifyEmail").checked =
            settings.notification_preferences.email || false;
          document.getElementById("notifySMS").checked =
            settings.notification_preferences.sms || false;
          document.getElementById("notifyPush").checked =
            settings.notification_preferences.push || false;
        }

        // Privacy Settings
        if (settings.privacy_settings) {
          const privacyOption = document.querySelector(
            `input[name="privacyOptions"][value="${settings.privacy_settings}"]`
          );
          if (privacyOption) privacyOption.checked = true;
        }

        // Language Preferences
        if (settings.language_preferences) {
          document.getElementById("languageSettings").value = settings.language_preferences || "en";
        }

        // Email Visibility
        if (settings.email_visibility) {
          const emailOption = document.querySelector(
            `input[name="emailVisibility"][value="${settings.email_visibility}"]`
          );
          if (emailOption) emailOption.checked = true;
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
