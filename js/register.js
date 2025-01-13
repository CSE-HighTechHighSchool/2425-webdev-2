// register.js

import { auth, db, createUserWithEmailAndPassword, ref, set, get } from "./firebase.js";

// Function to handle registration
document.getElementById("submitData").onclick = function () {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPass").value;
  const profilePic =
    "data:image/jpeg;base64,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";

  // Validate user inputs
  if (!validation(firstName, lastName, email, password)) {
    return;
  }

  // Create new user with email and password
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User successfully created and automatically signed in
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
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        profilePicture: profilePic,
      })
        .then(() => {
          // Data saved successfully
          // Fetch the user data to store in session storage
          const userRef = ref(db, "users/" + user.uid + "/accountInfo");
          return get(userRef);
        })
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userInfo = snapshot.val();
            logIn(userInfo);
          } else {
            alert("User data not found.");
          }
        })
        .catch((error) => {
          // Error saving or fetching data
          alert("Error saving user data: " + error.message);
        });
    })
    .catch((error) => {
      // Handle registration errors
      alert("Registration failed: " + error.message);
    });
};

// Function to log in the user by storing user info in session storage
function logIn(userInfo) {
  sessionStorage.setItem("userInfo", JSON.stringify(userInfo));

  alert(
    "Account created successfully. You are now logged in and will be redirected to the home page."
  );

  // Redirect to the home page or dashboard
  window.location.href = "home.html";
}

// Function to check for null, empty, or all spaces
function isEmptyOrSpaces(str) {
  return !str || str.trim().length === 0;
}

// Function to validate registration data
function validation(firstName, lastName, email, password) {
  const nameRegex = /^[a-zA-Z]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
