// register.js

import { auth, db, createUserWithEmailAndPassword, ref, set } from "./firebase.js";

// Function to handle registration
document.getElementById("submitData").onclick = function () {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPass").value;

  // Validate user inputs
  if (!validation(firstName, lastName, email, password)) {
    return;
  }

  // Create new user with email and password
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User successfully created
      const user = userCredential.user;

      // Encrypt the password before storing (optional and not recommended for actual password handling)
      const encryptedPassword = encryptPassword(password);

      // Save user information to Realtime Database
      set(ref(db, "users/" + user.uid + "/accountInfo"), {
        uid: user.uid,
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: encryptedPassword,
      })
        .then(() => {
          // Data saved successfully
          alert("Account created successfully!");
          // Redirect to login page or home page
          window.location.href = "login.html";
        })
        .catch((error) => {
          // Error saving data
          alert("Error saving user data: " + error.message);
        });
    })
    .catch((error) => {
      // Handle registration errors
      alert("Registration failed: " + error.message);
    });
};

// Function to check for null, empty, or all spaces
function isEmptyOrSpaces(str) {
  return !str || str.trim().length === 0;
}

// Function to validate registration data
function validation(firstName, lastName, email, password) {
  const nameRegex = /^[a-zA-Z]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@ctemc\.org$/; // Adjust the email regex as needed

  if (
    isEmptyOrSpaces(firstName) ||
    isEmptyOrSpaces(lastName) ||
    isEmptyOrSpaces(email) ||
    isEmptyOrSpaces(password)
  ) {
    alert("Please fill in all fields.");
    return false;
  }

  if (!nameRegex.test(firstName)) {
    alert("First name should only contain letters.");
    return false;
  }

  if (!nameRegex.test(lastName)) {
    alert("Last name should only contain letters.");
    return false;
  }

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }

  if (password.length < 6) {
    alert("Password should be at least 6 characters long.");
    return false;
  }

  return true;
}

function encryptPassword(password) {
  return CryptoJS.AES.encrypt(password, password).toString();
}
