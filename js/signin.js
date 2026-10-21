const loginBtn = document.getElementById("loginBtn");
const signUpBtn = document.getElementById("signUpBtn");
const signUpForm = document.getElementById("sign-up-form");
const loginForm = document.getElementById("login-form");
const container = document.querySelector(".container");

loginBtn.addEventListener("click", () => {
	container.classList.remove("right-panel-active");
});

signUpBtn.addEventListener("click", () => {
	container.classList.add("right-panel-active");
});

signUpForm.addEventListener("submit", (e) => e.preventDefault());
loginForm.addEventListener("submit", (e) => e.preventDefault());
