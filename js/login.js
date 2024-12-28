// ----------------- User Sign-In Page --------------------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } 
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

// ---------------------- Sign-In User ---------------------------------------//
document.getElementById('signIn').onclick = function(){

    // Get user's email and password for sign in
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Attempt to sign user in
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Create user credential and store user ID
        const user = userCredential.user;

        // Log sign-in in db
        // update - will only add the last_login info and won't overwrite anything else
        let logDate = new Date();
        update(ref(db, 'users/' + user.uid + '/accountInfo'), {
            last_login: logDate
        })
        .then(() => {
            // User signed in scucessfuly
            alert('User signed in successfully!');

            // Get snapshot of all the user info (including uid) to pass to 
            // the login() function and store in session or local storage
            return get(ref(db, 'users/' + user.uid + '/accountInfo'))
        })
        .then((snapshot)=>{
                if(snapshot.exists()){
                    //console.log(snapshot.val())
                    logIn(snapshot.val());
                } else {
                    console.log("User does not exist");
                }
            })
            .catch((error) => {
                console.log(error);
            })})
            .catch((error) => {
            alert(error.message);
        });
}


// ---------------- Keep User Logged In ----------------------------------//
function logIn(user){
    let keepLoggedIn = document.getElementById('keepLoggedInSwitch').ariaChecked;

    // Session storage is temporary (only while session is active)
    // Information saved as a string (must convert JS object to a string)
    // Session storage will be cleared with a signOut() function in home.js
    if(!keepLoggedIn){
        sessionStorage.setItem('user', JSON.stringify(user));
        window.location='home.html';    // Redirect browser to home.html
    }

    // Local storage is permanent (keep user logged in even if browser is closed)
    // Local storage will be cleared with a signOut() function in home.js
    else {
        localStorage.setItem('keepLoggedIn', 'yes');
        localStorage.setItem('user', JSON.stringify(user));
        window.location = 'home.html';
    }
}

