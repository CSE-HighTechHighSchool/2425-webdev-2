import { auth, signOut } from "./firebase.js";

// Add an event listener for the scroll event on the window object
window.addEventListener("scroll", function () {
  // Select the navbar element
  const navbar = document.querySelector(".navbar");
  // Select the navbar toggle button element
  const navToggle = document.querySelector(".navbar-toggler");

  // Check if the page has been scrolled more than 50 pixels vertically
  if (window.scrollY > 30) {
    // Add the "scrolled" class to the navbar and toggle button if scrolled more than 50 pixels
    navbar.classList.add("scrolled");
    navToggle.classList.add("scrolled");
  } else {
    // Remove the "scrolled" class from the navbar and toggle button if scrolled less than 50 pixels
    navbar.classList.remove("scrolled");
    navToggle.classList.remove("scrolled");
  }
});

// Change navbar items on login

// --------------------- Get reference values -----------------------------
let userLink = document.getElementById("userLink"); // User name for navbar
let signOutLink = document.getElementById("signOut"); // Sign in/out link
let welcome = document.getElementById("welcome"); // Welcome header (null if it does not exist)
let currentUser = null; // Initialize current user to null

// ----------------------- Get Username ------------------------------
function getUserName() {
  currentUser = JSON.parse(sessionStorage.getItem("userInfo"));
}

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function signOutUser() {
  sessionStorage.removeItem("userInfo");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("keepLoggedIn");

  signOut(auth)
    .then(() => {
      console.log("User signed out successfully.");
    })
    .catch((error) => {
      console.error("Error signing out: ", error);
    });

  window.location = "index.html";
}

window.onload = function () {
  // ------------------------- Set Welcome Message -------------------------
  getUserName(); // Get current user's first name
  if (currentUser == null) {
    userLink.innerText = "Sign Up";
    userLink.classList.add("btn-primary");
    userLink.href = "register.html";

    signOutLink.innerText = "Login";
    signOutLink.classList.add("btn-success");
    signOutLink.href = "login.html";

    const dashboardLink = document.getElementById("dashboardLink");
    dashboardLink.parentElement.removeChild(dashboardLink);
  } else {
    userLink.innerText = "Create/Delete Tour";
    if (welcome != null) {
      // Only edit the welcome screen if it exists
      welcome.innerText = currentUser.firstname + ", Experience the Magic of Venice";
    }
    userLink.classList.replace("btn", "nav-link");
    userLink.classList.add("btn-primary");
    userLink.href = "dashboard.html";

    signOutLink.innerText = "Sign Out";
    signOutLink.classList.replace("btn", "nav-link");
    userLink.classList.add("btn-success");
    document.getElementById("signOut").onclick = function () {
      signOutUser();
    };
  }
};

// if Create/Delete Tour is clicked, set the 'tourPressed' key in session storage to be true so user is automatically directed to the Book Tour section of the dashboard
userLink.onclick = function () {
  if (welcome != null) {
    sessionStorage.setItem("tourPressed", true);
  }
};
