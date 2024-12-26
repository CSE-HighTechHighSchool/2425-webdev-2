// This JS file is for registering a new app user ---------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { getDatabase, ref, set, update, child, get } 
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMTBvoF079f3sgApCsdKJcpRp7JsbPDSA",
  authDomain: "cantor-se2425-firebase-demo.firebaseapp.com",
  databaseURL: "https://cantor-se2425-firebase-demo-default-rtdb.firebaseio.com",
  projectId: "cantor-se2425-firebase-demo",
  storageBucket: "cantor-se2425-firebase-demo.firebasestorage.app",
  messagingSenderId: "75981795996",
  appId: "1:75981795996:web:20b041c48843d9d1a67359"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth();

// Return an instance of your app's database
const db = getDatabase(app)

// ---------------- Register New Uswer --------------------------------//

document.getElementById('submitData').onclick = function() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('userEmail').value;

  // Firebase requires a password of at least 6 characters
  const password = document.getElementById('userPass').value;

  // Validate user inputs
  if(!validation(firstName, lastName, email, password)){
    return;
  };

  // Create new app user using email/password auth
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Create user credential
    const user = userCredential.user;
    
    // Add user account info to realtime database
    // set - will create a new ref. or completely replace exisitng one
    // Each new user will be placed under the 'users' node
    set(ref(db, 'users/' + user.uid + '/accountInfo'), {
      uid: user.uid,    // save userID fo rhome.js reference
      email: email,
      password: encryptPass(password),
      firstname: firstName,
      lastname: lastName
    })
  })
  .then(() => {
    // Data saved successfully!
    alert('User created successfully!');
    window.location = 'login.html';
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
function validation(firstName, lastName, email, password){
  let fNameRegex = /^[a-zA-Z]+$/;
  let lNameRegex = /^[a-zA-Z]+$/;
  let emailRegex = /^[a-zA-Z]+@ctemc\.org$/;

  if(isEmptyorSpaces(firstName) || isEmptyorSpaces(lastName) ||
  isEmptyorSpaces(email) || isEmptyorSpaces(password)){
    alert("Please complete all fields.");
    return false;
  }
  if(!fNameRegex.test(firstName)){
    alert("The first name should only contain letters.");
    return false;
  }
  if(!lNameRegex.test(lastName)){
    alert("The last name should only contain letters.");
    return false;
  }
  if(!emailRegex.test(email)){
    alert("Please enter a valid email.");
    return false;
  }
  return true;
}

// --------------- Password Encryption -------------------------------------//
function encryptPass(password){
  let encrypted = CryptoJS.AES.encrypt(password, password);
  return encrypted.toString();
}

