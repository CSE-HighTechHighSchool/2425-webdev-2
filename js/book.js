import { auth, db, signInWithEmailAndPassword, ref, update, get } from "./firebase.js";

// Function to handle login
document.getElementById("setButton").onclick = function () {
  const length = document.getElementById("setLength").value.trim();
  const size = document.getElementById("setSize").value.trim();
  const vip = document.getElementById("setVIP").value.trim();
  const number = document.getElementById("setNumber").value.trim();
  const first = document.getElementById("setFirst").value.trim();
  const second = document.getElementById("setSecond").value.trim();
  const third = document.getElementById("setThird").value.trim();
  const date = document.getElementById("setDate").value.trim();

  const userRef = ref(db, "users/" + user.uid + "/tours");

  set(userRef, {date: date})
    .then(()=> {
        const newRef = ref(db, "users/" + user.uid + "/tours/" + date)
        set(newRef, {
            length: length,
            size: size,
            vip: vip,
            number: number,
            first: first,
            second: second,
            third: third
        })
        .then(()=> {
            alert("Tour successfully added!")
        })
        .catch((error)=> {
            alert("Error: " + error.message)
        });
    })
    .catch((error)=> {
        alert("Error: " + error.message)
    });
}

document.getElementById("getButton").onclick = function () {
    const date = document.getElementById("getDate").value.trim();
    const userRef = ref(db, "users/" + user.uid + "/tours/" + date)

    get(userRef)
    .then((snapshot) => {
        if (snapshot.exists()) {
            addHeader("getTable");
            getTour(snapshot.val(), "getTable");
        } else {
            alert("User data not found.");
        }
    })
    .catch((error) => {
    alert("Error: " + error.message);
    });
}

document.getElementById("listButton").onclick = function () {
    const userRef = ref(db, "users/" + user.uid + "/tours")

    get(userRef)
    .then((snapshot) => {
        if (snapshot.exists()) {
            addHeader("getList");
            snapshot.forEach((child) => {
                addTour(child, "getList")
            })
        } else {
            alert("User data not found.");
        }
    })
    .catch((error) => {
    alert("Error: " + error.message);
    });
}

document.getElementById("removeButton").onclick = function () {
    const date = document.getElementById("removeDate").value.trim();
    const userRef = ref(db, "users/" + user.uid + "/tours/" + date);
    remove(userRef)
    .then(() => {
        alert("Tour removed successfully.");
    })
    .catch((error) => {
        alert("Error: " + error);
    })
}

function addTour(value, table) {
    //add rows dynamically to id="table"
}

function addHeader(table) {
    //add header row to id="table"
}
