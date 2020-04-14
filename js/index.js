// listen for auth changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user.email, "has logged in");
    document.querySelector(".container").style.display = "none";
  } else {
    console.log("user has logged out");
    document.querySelector("#signup-form").style.display = "none";
    document.querySelector("#signin-form").style.display = "block";
    document.querySelector("#logout-btn").style.display = "none";
  }
});

// Register form
const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", (e) => {
  //   prevent page refresh
  e.preventDefault();

  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  auth.createUserWithEmailAndPassword(email, password).then((cred) => {
    signupForm.reset();
  });
});

// Log in Form
const signinForm = document.querySelector("#signin-form");

signinForm.addEventListener("submit", (e) => {
  //   prevent page refresh
  e.preventDefault();

  const email = signinForm["signin-email"].value;
  const password = signinForm["signin-password"].value;

  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    signinForm.reset();
    window.location.href = "/pages/user-main-page.html";
  });
});

// Logout Button
const logout = document.querySelector("#logout-btn");

logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {});
});
