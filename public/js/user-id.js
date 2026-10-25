import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

function getCurrentUserId() {
    return new Promise((resolve) => {
        const stop = onAuthStateChanged(auth, (user) =>{
            stop();
            resolve(user === null ? null : user.uid);
        });
    });
}

export async function getFavouritesKey() {
    const uid = await getCurrentUserId();

    if (uid === null) {
        return "favourites_guest";
    }

    return "favourites_" + uid;
}