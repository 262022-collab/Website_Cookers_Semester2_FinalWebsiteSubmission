import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

import { auth } from "./firebase-config.js";

const signUpBtn = document.getElementById("signUpBtn");
const loginBtn = document.getElementById("loginBtn");
const signUpForm = document.getElementById("signUpForm");
const loginForm = document.getElementById("loginForm");
const container = document.querySelector(".container");
const signUpEmailInput = document.getElementById("email-input-signUp");
const signUpPasswordInput = document.getElementById("password-input-signUp");
const loginEmailInput = document.getElementById("email-input-login");
const loginPasswordInput = document.getElementById("password-input-login");
const signUpMessage = document.getElementById("signUpMessage");
const loginMessage = document.getElementById("loginMessage");

loginBtn.addEventListener("click", () => {
	container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
	container.classList.add("right-panel-active");
});

signUpForm.addEventListener("submit", (e) => {
	e.preventDefault();
	handleSignUp(signUpEmailInput.value, signUpPasswordInput.value);
});

loginForm.addEventListener("submit", (e) => {
	e.preventDefault();
	handleLogin(loginEmailInput.value, loginPasswordInput.value)
})

function showMessage(messageElement, messageContent, messageType){
	messageElement.textContent = messageContent;
	messageElement.className = messageType;
}

function getFriendlyErrorMessage(errorCode) {
	let friendlyMessage = "Something went wrong. Please try again.";

	if (errorCode === "auth/invalid-credential"){
		friendlyMessage = "Incorrect email or password.";
	}else if (errorCode === "auth/email-already-in-use"){
		friendlyMessage = "An account with this email already exists";
	}else if (errorCode === "auth/weak-password"){
		friendlyMessage = "Password must be at least 6 characters long.";
	}else if (errorCode === "auth/invalid-email" ){
		friendlyMessage = "Please enter a valid email address.";
	}else if(errorCode === "auth/too-many-requests"){
		friendlyMessage = "Too many attempts. Please wait a moment and try again.";
	}

	return friendlyMessage;
}

async function handleSignUp(userEmail, userPassword){
	createUserWithEmailAndPassword(auth, userEmail, userPassword)
	.then(function(userCredential){
		console.log("New Account created for: " + userCredential.user.email);

		signOut(auth)
		.then(function (){
			container.classList.remove("right-panel-active");
			signUpPasswordInput.value = "";
			showMessage(loginMessage, "Account created! Please log in.", "success");
			showMessage(signUpMessage, "", "");
		});
	})

	.catch(function (error){
		console.log("Sign up Error " + error.code);
		let friendlyMessage = getFriendlyErrorMessage(error.code);
		showMessage(signUpMessage, friendlyMessage, "error");
	});
}

async function handleLogin(userEmail, userPassword){
	signInWithEmailAndPassword(auth, userEmail, userPassword)
	.then(function (userCredential) {
		console.log("Logged in as: " + userCredential.user.email);

		window.location.href = "index.html";
	})
	.catch(function(error){
		console.log("Log in Error: " + error.code);
		let friendlyMessage = getFriendlyErrorMessage(error.code);
		showMessage(loginMessage, friendlyMessage, "error");
	});
}
