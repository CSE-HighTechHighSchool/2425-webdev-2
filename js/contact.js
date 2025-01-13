// Import Firebase setup and utilities from firebase.js
import { db, ref, update, get } from "./firebase.js";

// ---------------- Send new message --------------------------------//

document.getElementById("sendMessage").onclick = function () {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // Validate user inputs
  if (!validation(name, email, subject, message)) {
    return;
  }

  // Index message by logDate
  const logDate = new Date().toISOString().replace(".", "-");

  // Add uid to database if it exists
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  if (userInfo != null && userInfo != undefined) {
    update(ref(db, "messages/" + logDate), {
      uid: userInfo["uid"],
    });
  }

  // Add input information
  update(ref(db, "messages/" + logDate), {
    name: name,
    subject: subject,
    message: message,
    email: email,
  })
    .then(() => {
      // Data was successfully written to Firebase
      document.getElementById("contactForm").reset();

      // Show the confirmation modal
      const modal = new bootstrap.Modal(document.getElementById("contactConfirmationModal"));
      modal.show();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
};

// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

// ---------------------- Validate Registration Data -----------------------//
function validation(name, email, subject, message) {
  const nameRegex = /^[a-zA-Z]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (
    isEmptyorSpaces(name) ||
    isEmptyorSpaces(email) ||
    isEmptyorSpaces(subject) ||
    isEmptyorSpaces(message)
  ) {
    alert("Please complete all fields.");
    return false;
  }
  if (!nameRegex.test(name)) {
    alert("The name should only contain letters.");
    return false;
  }
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email.");
    return false;
  }
  if (!subjectRegex.test(subject)) {
    alert("The subject should only contain letters.");
    return false;
  }
  return true;
}
