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
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
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

// Modal Triggers
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

// Upload Quote to Firebase Storage
const progressBar = document.getElementById('pgb')
const file_form = document.querySelector('#file-upload-form');
const file_upload = document.getElementById('upload-file-btn');

// Get File everytime user press the file button
file_upload.addEventListener("change", (e) => {

  var file = e.target.files[0];

  // Wait till user clicks submit
  file_form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Create reference in Firebase Storage
    var storageRef = storage.ref('quotes/' + file.name);

    // Task to put file into Firebase Storage
    var task = storageRef.put(file);

    // Wait for progress bar to catch up
    function wait() {
      if (progressBar.style.width == '100%') {
        document.querySelector(".progress").style.display = "none";
        document.querySelector('#upload-file-btn').disabled = false;
        document.querySelector('.submit-quote-button').disabled = false;
        const modal = document.querySelector("#modal-qotd");
        M.Modal.getInstance(modal).close();
        document.getElementById("file-upload-form").reset();
      }
    }

    // State change on progress of uploading file
    task.on('state_changed', function progress(snapshot) {

      document.querySelector(".progress").style.display = "block";
      document.querySelector('#upload-file-btn').disabled = true;
      document.querySelector('.submit-quote-button').disabled = true;



      var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      progressBar.style.width = percentage + "%";
    },
      function error(err) {
        console.log(err);
      },
      function complete() {
        setTimeout(wait, 1000);
      }
    );
  });
});


