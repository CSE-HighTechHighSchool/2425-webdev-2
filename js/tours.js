import { auth, db, signInWithEmailAndPassword, ref, update, get, set, remove } from "./firebase.js";
let tourArray = []

// functions run if a premade tour is selected or custom tour link is clicked
// tour array is populated and saved in session storage
// 'tourPressed' key changed to true so user is automatically directed to Book Tour section of dashboard.html
document.getElementById("premiumBtn").onclick = function () {
  tourArray = [8, 'Private', 'Yes', 7, 'Scuola Grande di San Rocco', 'Academia Gallery', 'St. Mark\'s Basilica']
  sessionStorage.setItem('tourCustomization', JSON.stringify(tourArray))
  sessionStorage.setItem('tourPressed', true)
  window.location.href = "dashboard.html";
};

document.getElementById("standardBtn").onclick = function () {
  tourArray = [5, 10, 'No', 5, 'Peggy Guggenheim Collection', 'Doge\'s Palace', 'La Fenice Opera House']
  sessionStorage.setItem('tourCustomization', JSON.stringify(tourArray))
  sessionStorage.setItem('tourPressed', true)
  window.location.href = "dashboard.html";
}

document.getElementById("basicBtn").onclick = function () {
  tourArray = [3, 15, 'No', 3, 'Basilica di Santa Maria della Salute', 'Doge\'s Palace', 'St. Mark\'s Basilica']
  sessionStorage.setItem('tourCustomization', JSON.stringify(tourArray))
  sessionStorage.setItem('tourPressed', true)
  window.location.href = "dashboard.html";
}

document.getElementById("customTour").onclick = function () {
  sessionStorage.setItem('tourPressed', true)
  window.location.href = "dashboard.html";
}