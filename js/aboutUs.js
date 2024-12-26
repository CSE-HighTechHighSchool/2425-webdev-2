import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { getDatabase, ref, set, update, child, get, remove } 
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



// ---------------------// Get reference values -----------------------------
let userLink = document.getElementById('userLink');     // User name for navbar
let signOutLink = document.getElementById('signOut');   // Sign out link
let currentUser = null;                                 // Initialize current user to null


// ----------------------- Get User's Name'Name ------------------------------
function getUserName(){
  // Grab value for the 'keep logged in' switch
  let keepLoggedIn = localStorage.getItem('keepLoggedIn');

  // Grab the user information from the signIn.JSF
  if(keepLoggedIn == 'yes'){
    currentUser = JSON.parse(localStorage.getItem('user'));
  } else {
    currentUser = JSON.parse(sessionStorage.getItem('user'));
  }
}

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function signOutUser(){
  sessionStorage.removeItem('user');
  localStorage.removeItem('user');
  localStorage.removeItem('keepLoggedIn');

  signOut(auth).then(() => {
    //Sign out successful
  }).catch((error) => {
    // Error occured
  });

  window.location = 'index.html';
}

window.onload = function(){
    // ------------------------- Set Welcome Message -------------------------
    getUserName();    // Get current user's first name
    if(currentUser == null){
      userLink.innerText = "Sign Up";
      userLink.classList.replace('nav-link', 'btn');
      userLink.classList.add('btn-primary');
      userLink.href = 'register.html';
  
      signOutLink.innerText = 'Sign In';
      signOutLink.classList.replace('nav-link', 'btn');
      signOutLink.classList.add('btn-success');
      signOutLink.href = 'login.html';
    } else {
      userLink.innerText = 'Create/Delete Tour';
      userLink.classList.replace('btn', 'nav-link');
      userLink.classList.add('btn-primary');
      userLink.href = 'book.html';
  
      signOutLink.innerText = 'Sign Out';
      signOutLink.classList.replace('btn', 'nav-link');
      userLink.classList.add('btn-success');
      document.getElementById('signOut').onclick = function(){
        signOutUser();
      }
    }
}