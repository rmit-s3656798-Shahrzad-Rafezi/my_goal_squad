auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user.email, "has logged in");

    var userPicture;

    if (user.photoURL == null) {
      userPicture = "/img/empty-profile.png";
    } else {
      userPicture = user.photoURL;
    }

    let userData = `   
      <div id="picture-container">
        <img class="userImg" src="${userPicture}">
        <button id="" class="waves-effect waves-grey btn-flat change-picture">
          <i class="material-icons">edit</i>Edit
        </button>
      </div>
      <div id="text-container">
        <span class="data">${user.displayName}<i class="material-icons" id="change-name">edit</i></span>
        <span class="data">${user.email}<i class="material-icons" id="change-email">edit</i></span>
        <span class="data">Change Password<i class="material-icons" id="change-password">edit</i></span>
      </div>      
            `;


    let userDiv = document.querySelector("#userData");
    userDiv.innerHTML += userData;

    $(".change-picture").click(() => {
      M.toast({ html: 'Picture Changed' })
      // alert("tet")
      // console.log("test")
    })

  } else {
    console.log("user has logged out");
  }
});

$(document).on("click", "i", function () {
  switch (this.id) {
    // case "change-picture":
    //   M.toast({ html: 'Picture Changed' })
    //   break;
    case "change-name":
      M.toast({ html: 'Name Changed' })
      break;
    case "change-email":
      M.toast({ html: 'Email Changed' })
      break;
    case "change-password":
      M.toast({ html: 'Password Changed' })
      break;
  }
});

$('#logout-btn').click(() => {
  auth.signOut().then(() => {
      window.location.href = "../index.html";
  });
})