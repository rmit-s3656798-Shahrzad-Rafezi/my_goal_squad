//checks to see if that user has logged in
auth.onAuthStateChanged((user) => {
  if (user) {

    console.log(user.email, "has logged in");
    
    var user = db.collection('users').doc(user.uid);
    var goals = user.collection('Goals').doc('Year');
    var year = goals.collection('2020').doc('Month');
    var month = year.collection('January').doc('Week');
    var week = month.collection('Week1').doc('Type');
    var type = week.collection("Personal");

    type.get().then((snapshot) =>{
      snapshot.docs.forEach(doc =>{
        console.log(doc.data());
      });
    });

  } else {
    // TODO: leave an empty string
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
