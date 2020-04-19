auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user.email, "has logged in");
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

// Gratitdue Journal Button
const jounral = document.querySelector("#gratitude-btn");

jounral.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/pages/gratitude-journal.html";
});