import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import { auth } from "./firebase-config.js";

const authLink = document.getElementById("authLink");

if (authLink !== null){
let isSignedIn = false;

onAuthStateChanged(auth, (user) => {
    if (user === null) {
        isSignedIn = false;
        authLink.textContent = "Sign In";
    } else {
        isSignedIn = true;
        authLink.textContent = "Sign Out";
    }
});

authLink.addEventListener("click", (event) => {
    if (isSignedIn === true) {
        event.preventDefault();

        signOut(auth)
        .then(function () {
            window.location.href = "/public/sign_in.html"
        })
        .catch(function(error) {
            console.log("Sign our error:" + error.code);
            alert("Could not sign out. Please wait a moment and try again.")
        });
    }

});

}