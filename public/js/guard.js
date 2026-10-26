import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import { auth } from "./firebase-config.js";

//send signed out visitors to login page
onAuthStateChanged(auth, (user) => {
    if (user === null) {
        window.location.href = new URL("../sign_in.html", import.meta.url).href;
    }
});