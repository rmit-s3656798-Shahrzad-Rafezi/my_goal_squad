// listen for auth changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user.email, "has logged in");
    document.querySelector(".container").style.display = "none";
    user.getIdTokenResult().then(idTokenResult => {
      if (idTokenResult.claims.admin) {
        window.location.href = "/pages/admin-page.html";
      } else {
        window.location.href = "/pages/user-main-page.html";
      }
    })
  } else {
    console.log("user has logged out");
    document.querySelector("#signin-form").style.display = "block";
  }
});

// Log in Form
const signinForm = document.querySelector("#signin-form");

signinForm.addEventListener("submit", (e) => {
  //   prevent page refresh
  e.preventDefault();

  document.querySelector("#signin-form").style.display = "none";
  document.querySelector(".progress").style.display = "block";
  document.querySelector("#error-message").style.display = "none";

  const email = signinForm["signin-email"].value;
  const password = signinForm["signin-password"].value;

  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    signinForm.reset();
    auth.onAuthStateChanged((user) => {
      user.getIdTokenResult().then(idTokenResult => {
        if (idTokenResult.claims.admin) {
          window.location.href = "/pages/admin-page.html";
        } else {
          window.location.href = "/pages/user-main-page.html";
        }
      })
    });
  }).catch((error) => {
    document.querySelector("#signin-form").style.display = "block";
    document.querySelector(".progress").style.display = "none";
    document.querySelector("#error-message").style.display = "block";

    signinForm.reset();

    let error_message = `
      <span>${error}</span>
      `;

    let error_div = document.querySelector("#error-message");
    error_div.innerHTML = error_message;

    // alert(error)
  });
});
