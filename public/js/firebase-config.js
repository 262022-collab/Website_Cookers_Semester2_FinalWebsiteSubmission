import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyClPz1ndu3gBuV8aeM1NT9ApMepiNzly-w",
  authDomain: "class-login-2315f.firebaseapp.com",
  projectId: "class-login-2315f",
  storageBucket: "class-login-2315f.firebasestorage.app",
  messagingSenderId: "181131080872",
  appId: "1:181131080872:web:97a09cafda98df8076be9d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);