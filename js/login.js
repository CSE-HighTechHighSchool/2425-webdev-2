// login.js

import { auth, db, signInWithEmailAndPassword, ref, update, get } from "./firebase.js";

// Function to handle login
document.getElementById("signIn").onclick = function () {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  // Attempt to sign in the user
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // User successfully signed in
      const user = userCredential.user;

      // Log the login time in the database
      const logDate = new Date().toISOString();
      const userRef = ref(db, "users/" + user.uid + "/accountInfo");

      update(userRef, {
        last_login: logDate,
      })
        .then(() => {
          // Fetch user information
          return get(userRef);
        })
        .then((snapshot) => {
          if (snapshot.exists()) {
            logIn(snapshot.val());
          } else {
            alert("User data not found.");
          }
        })
        .catch((error) => {
          alert("Error updating login time: " + error.message);
        });
    })
    .catch((error) => {
      // Handle login errors
      alert("Login failed: " + error.message);
    });
};

// Function to keep the user logged in
function logIn(userInfo) {
  let keepLoggedIn = document.getElementById('keepLoggedInSwitch').ariaChecked;

    // Session storage is temporary (only while session is active)
    // Information saved as a string (must convert JS object to a string)
    // Session storage will be cleared with a signOut() function in home.js
    if(!keepLoggedIn){
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        window.location='home.html';    // Redirect browser to home.html
    }

    // Local storage is permanent (keep user logged in even if browser is closed)
    // Local storage will be cleared with a signOut() function in home.js
    else {
        localStorage.setItem('keepLoggedIn', 'yes');
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        window.location = 'home.html';
    }
}
