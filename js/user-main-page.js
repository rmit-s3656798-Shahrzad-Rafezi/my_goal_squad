//checks to see if that user has logged in
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user.email, "has logged in");
    //gets data
    db.collection('users').doc(user.uid).collection('Goals').doc('Year').collection('2020').doc('Month').collection('January').doc('Week').collection('Week1').doc('Type').collection('Personal').doc('ilk1m1bxJScQxkcGb2Nj').get().then(doc => {
      console.log(doc.data());
    })
    // db.collection('users').get().then(snapshot =>{
    //   console.log(snapshot.docs);
    // });
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
