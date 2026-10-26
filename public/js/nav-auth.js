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
            window.location.href = new URL("sign_in.html", import.meta.url).href;
        })
        .catch(function(error) {
            console.log("Sign out error:" + error.code);
            alert("Could not sign out. Please wait a moment and try again.")
        });
    }

});

}

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const query = searchInput.value.trim();
    if (query === "") return;

    const inPagesFolder = window.location.pathname.includes("/pages/");
    const libraryPath = inPagesFolder ? "library.html" : "pages/library.html";

    window.location.href = `${libraryPath}?search=${encodeURIComponent(query)}`;
});