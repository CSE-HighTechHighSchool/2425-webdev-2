// firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  update,
  get,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firebase Database
const db = getDatabase(app);

// Export auth and db for use in other modules
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  ref,
  set,
  update,
  get,
  onAuthStateChanged,
};
