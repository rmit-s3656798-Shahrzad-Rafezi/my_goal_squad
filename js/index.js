const signupForm = document.querySelector("#signup-form");

signupForm.addEventListener("submit", (e) => {
  //   prevent page refresh
  e.preventDefault();

  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  auth.createUserWithEmailAndPassword(email, password).then((cred) => {
    console.log("User Registered");
    signupForm.reset();
  });
});

const logout = document.querySelector("#logout");

logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("User Signed Out");
  });
});

const signinForm = document.querySelector("#signin-form");

signinForm.addEventListener("submit", (e) => {
  //   prevent page refresh
  e.preventDefault();

  const email = signinForm["signin-email"].value;
  const password = signinForm["signin-password"].value;

  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    console.log("User Signed In");
    signinForm.reset();
  });
});
