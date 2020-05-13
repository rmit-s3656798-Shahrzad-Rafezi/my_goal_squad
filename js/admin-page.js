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
          // console.log(result);
          if (result.data == true) {
            document.querySelector("#error-message").style.display = "none";
            M.toast({ html: name + ' has been registered', classes: 'rounded' });
            const modal = document.querySelector("#modal-signup");
            M.Modal.getInstance(modal).close();
            signupForm.reset();
          } else {
            document.querySelector("#error-message").style.display = "block";

            let error_message = `
              <span>${result.data.errorInfo.message}</span>
               `;

            let error_div = document.querySelector("#error-message");
            error_div.innerHTML = error_message;

            // console.log(result.data.errorInfo.message)
          }
        });
      } else {
        console.log('You are not an admin');
      }
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

  var quoteLimit = 3;
  var file = e.target.files[0];

  // Wait till user clicks submit
  file_form.addEventListener("submit", (e) => {
    e.preventDefault();
    let quoteLimit = 3;

    // Delete a random quote when limit is reached
    deleteRandomQuote(quoteLimit)

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

// Random Number Generator
function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min))
}

// Delete Random Quote when limit is reached
function deleteRandomQuote(limit) {
  let x = 0;
  var storageRef = firebase.storage().ref("quotes");
  storageRef.listAll().then((result) => {
    result.items.forEach((item) => {
      x += 1;
    });
    if (x >= limit) {

      var file = result.items[generateRandomInteger(0, 2)];

      file.getMetadata().then((data) => {
        // Create a reference to the file to delete
        var earliestFile = storageRef.child(data.name);

        // Delete the file
        earliestFile.delete().then(function () {
          // File deleted successfully
          console.log("File Deleted Successfully")
          return true;
        }).catch(function (error) {
          // Uh-oh, an error occurred!
          console.log(error)
        });
      })
    };
  });

}