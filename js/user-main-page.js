//checks to see if that user has logged in
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user.email, "has logged in");
    //gets data
    db.collection('users').doc(user.uid).get().then(doc => {
      // TODO: add more functionality
      console.log(doc.data().Title);
    })
  } else {
    console.log("user has logged out");
  }
});

// Logout Button
const logout = document.querySelector("#logout-btn");

logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    window.location.href = "../index.html";
  });
});
