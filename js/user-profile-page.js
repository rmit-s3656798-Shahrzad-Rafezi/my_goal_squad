auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user.email, "has logged in");

    var userPicture;

    if (user.photoURL == null) {
      userPicture = "/img/empty-profile.png";
    } else {
      console.log('test2: ' + user.uid)

      let path = 'users/' + user.uid + "/profilePicture.png"
      // var starsRef = storageRef.child('images/stars.jpg');

      var test = storage.ref(path);

      console.log('test3: ' + test)

      test.getDownloadURL().then(function (url) {
        console.log('test4: ' + url)
        userPicture = url;
        renderUserData(url, user.displayName, user.email)

      }).catch(function (error) {
        console.log(error)
      });
    }

    function renderUserData(userPicture, userName, userEmail) {
      let userData = `   
      <div id="picture-container">
        <img class="userImg" src="${userPicture}">
        <button data-target="modal-img" class="waves-effect waves-grey btn-flat modal-trigger">
          <i class="material-icons">edit</i>Edit
        </button>
      </div>
      <div id="text-container">
        <span class="data">Name: <b>${userName}</b><i data-target="modal-name" class="material-icons modal-trigger" id="change-name">edit</i></span>
        <span class="data">Email: <b>${userEmail}</b><i data-target="modal-email" class="material-icons modal-trigger" id="change-email">edit</i></span>
        <span class="data"><b>Change Password</b><i data-target="modal-pw" class="material-icons modal-trigger" id="change-password">edit</i></span>
      </div>      
            `;


      let userDiv = document.querySelector("#userData");
      userDiv.innerHTML += userData;
    }
  } else {
    console.log("user has logged out");
  }
});

// $(document).on("click", "i", function () {
//   switch (this.id) {
//     case "change-name":

//       break;
//     case "change-email":
//       M.toast({ html: 'Email Changed' })
//       break;
//     case "change-password":
//       break;
//   }
// });

// Logout Button
// ===============================================================
$('#logout-btn').click(() => {
  auth.signOut().then(() => {
    window.location.href = "../index.html";
  });
})


// Modal Triggers
// ===============================================================
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

// Reauthenticate user
// ===============================================================
reauthenticate = (currentPassword) => {
  var user = auth.currentUser;
  var cred = firebase.auth.EmailAuthProvider.credential(
    user.email, currentPassword);
  return user.reauthenticateWithCredential(cred);
}


// Update Name
// ===============================================================
const updateNameForm = document.querySelector("#name-form");

updateNameForm.addEventListener("submit", (e) => {
  e.preventDefault()

  $('.preloader').css('display', 'block')
  $('#name-form').css('display', 'none')

  var user = auth.currentUser;
  const name = this["update-name"].value;

  user.updateProfile({
    displayName: name
  }).then(function () {
    // Update successful.

    M.Modal.getInstance($('#modal-name')).close();
    M.toast({ html: 'Name has been updated successfully' })
    updateNameForm.reset();
    setTimeout(() => {
      location.reload()
    }, 500)

  }).catch(function (e) {
    console.log(e)
  });
})

// Update Email
// ===============================================================
const updateEmailForm = document.querySelector("#email-form");

updateEmailForm.addEventListener("submit", (e) => {
  e.preventDefault()

  $('.preloader').css('display', 'block')
  $('#email-form').css('display', 'none')

  const new_email = this["update-email"].value;
  const cur_pw = this['email-pw'].value

  reauthenticate(cur_pw).then(() => {

    var user = auth.currentUser;

    user.updateEmail(new_email).then(() => {

      M.Modal.getInstance($('#modal-email')).close();
      updateEmailForm.reset();
      M.toast({ html: 'Email update successfully' })

      setTimeout(() => {
        location.reload()
      }, 500)

    }).catch((e) => {

      let error_message = `
          <span>${e}</span>
        `
      let error_div = document.querySelector(".error-message");
      error_div.innerHTML = error_message;
    });
  }).catch((e) => {

    let error_message = `
        <span>${e}</span>
      `
    let error_div = document.querySelector(".error-message");
    error_div.innerHTML = error_message;
  });

})

// Update Password
// ===============================================================
const updatePasswordForm = document.querySelector("#pw-form");

updatePasswordForm.addEventListener("submit", (e) => {
  e.preventDefault()

  $('.preloader').css('display', 'block')
  $('#pw-form').css('display', 'none')

  const old_pw = this['current-pw'].value
  const new_pw = this["update-pw"].value;
  const con_pw = this["check-pw"].value;

  reauthenticate(old_pw).then(() => {
    if (new_pw === con_pw) {
      var user = auth.currentUser;
      user.updatePassword(new_pw).then(() => {

        M.Modal.getInstance($('#modal-pw')).close();
        M.toast({ html: 'Password has been updated successfully' })
        updatePasswordForm.reset();

      }).catch((e) => {
        let error_message = `
            <span>${e}</span>
          `
        let error_div = document.querySelector(".error-message");
        error_div.innerHTML = error_message;
      });
    } else {

      let error_message = `
            <span>Password is not the same</span>
          `
      let error_div = document.querySelector(".error-message");
      error_div.innerHTML = error_message;
    }
  }).catch((e) => {

    let error_message = `
        <span>${e}</span>
      `
    let error_div = document.querySelector(".error-message");
    error_div.innerHTML = error_message;
  });
})

// Update Image
// ===============================================================
const progressBar = document.getElementById('pgb')
const file_form = document.querySelector('#file-upload-form');
const file_upload = document.getElementById('upload-file-btn');

file_upload.addEventListener("change", (e) => {

  var file = e.target.files[0];

  // Wait till user clicks submit
  file_form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Create reference in Firebase Storage
    var user = auth.currentUser;
    let uid = user.uid;
    console.log(uid)
    var storageRef = storage.ref('users/' + uid + '/profilePicture.png');

    // // Task to put file into Firebase Storage
    var task = storageRef.put(file);

    // // Wait for progress bar to catch up
    function wait() {
      if (progressBar.style.width == '100%') {
        document.querySelector(".preloader").style.display = "none";
        document.querySelector('#upload-file-btn').disabled = false;
        document.querySelector('.submit-quote-button').disabled = false;
        const modal = document.querySelector("#modal-img");
        M.Modal.getInstance(modal).close();
        document.getElementById("file-upload-form").reset();
      }
    }

    // // State change on progress of uploading file
    task.on('state_changed', function progress(snapshot) {

      document.querySelector(".preloader").style.display = "block";
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

        var uid = auth.currentUser.uid;
        console.log('test1: ' + uid)
        const file_path = 'users/' + uid + '/profilePicture.png';

        user.updateProfile({
          photoURL: file_path
        }).then(function () {
          // Update successful.
          M.toast({ html: 'Profile picture has been updated successfully' })
          setTimeout(() => {
            location.reload()
          }, 500)
        }).catch(function (e) {
          console.log(e)
        });
      }
    );
  });
});

