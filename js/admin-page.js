// listen for auth changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user.email, "has logged in");
  } else {
    console.log("user has logged out");
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

// Logout Button
const logout = document.querySelector("#logout-btn");

logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    window.location.href = "../index.html";
  });
});

// Make Admin
const adminForm = document.querySelector("#make-admin");

adminForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const userEmail = adminForm["admin-email"].value;
  const makeAdmin = functions.httpsCallable('makeAdminRole');

  makeAdmin({ email: userEmail }).then(result => {
    console.log(result)
  })

  // auth.getUserByEmail(email).then((user) => {
  //   console.log(user.getUid());
  // });
  // admin.auth().setCustomUserClaims( adminEmail["admin-email"].value, {admin: true}).then(() => {
  //    console.log(email);
  // })
});
