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

  const name = signupForm["user-name"].value;
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  const tel = signupForm["signup-number"].value;

  const newUser = {
    name,
    email,
    password,
    tel
  };

  const addNewUser = functions.httpsCallable('createNewUser');

  auth.onAuthStateChanged((user) => {
    user.getIdTokenResult().then(idTokenResult => {
      if (idTokenResult.claims.admin) {
        addNewUser(newUser).then(result => {
          console.log(result);
        });
      } else {
        console.log('You are not an admin');
      }
      signupForm.reset();
    })
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

  auth.onAuthStateChanged((user) => {
    user.getIdTokenResult().then(idTokenResult => {
      if (idTokenResult.claims.admin) {
        makeAdmin({ email: userEmail }).then(result => {
          console.log(result)
        })
      } else {
        console.log('You are not an admin');
      }
    })
  });

});