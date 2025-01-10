// This JS file is for registering a new app user ---------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword} 
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { getDatabase, ref, set, update, child, get } 
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_FlHseyUfZEtXE5QekhGHPMkIgatlS3o",
  authDomain: "tour-venice.firebaseapp.com",
  databaseURL: "https://tour-venice-default-rtdb.firebaseio.com",
  projectId: "tour-venice",
  storageBucket: "tour-venice.firebasestorage.app",
  messagingSenderId: "632244452533",
  appId: "1:632244452533:web:920f67238e2f44b75952fc",
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth();

// Return an instance of your app's database
const db = getDatabase(app)

// ---------------- Send new message --------------------------------//


document.getElementById('sendMessage').onclick = function() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  // Validate user inputs
  if(!validation(name, email, subject, message)){
    return;
  };

  // Index message by logDate
  const logDate = new Date().toISOString().replace(".", "-");
  
  // Add uid to database if it exists
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  if (userInfo != null && userInfo != undefined) {
    update(ref(db, "messages/" + logDate), {
        uid: userInfo["uid"]
    })
  }

  // Add input information
  update(ref(db, "messages/" + logDate), {
      name: name,
      subject: subject,
      message: message,
      email: email
  })
  .then((snapshot) => {
    // Data saved successfully!
    alert('Message sent. We will get back to you in 2-3 business days.');
  })
  .catch((error) => {
    // Data write failed...
    alert(error);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  });
}


// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str){
  return str === null || str.match(/^ *$/) !== null
}

// ---------------------- Validate Registration Data -----------------------//
function validation(name, email, subject, message){
  let nameRegex = /^[a-zA-Z]+$/;
  let emailRegex = /^[a-zA-Z]+@ctemc\.org$/;
  let subjectRegex = /^[a-zA-Z]+$/;
  let messageRegex = /^[a-zA-Z]+$/;

  if(isEmptyorSpaces(name) || isEmptyorSpaces(email) ||
  isEmptyorSpaces(subject) || isEmptyorSpaces(message)){
    alert("Please complete all fields.");
    return false;
  }
  if(!nameRegex.test(name)){
    alert("The name should only contain letters.");
    return false;
  }
  if(!emailRegex.test(email)){
    alert("Please enter a valid email.");
    return false;
  }
  if(!subjectRegex.test(subject)){
    alert("The subject should only contain letters.");
    return false;
  }
  return true;
}
