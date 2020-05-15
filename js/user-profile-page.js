auth.onAuthStateChanged((user) => {
    if (user) {
      console.log(user.email, "has logged in");
    } else {
      console.log("user has logged out");
    }
  });