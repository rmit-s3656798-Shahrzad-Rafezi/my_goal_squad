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

// This is for selection, tabs, modal element in HTML file (CSS Materialize)
document.addEventListener('DOMContentLoaded', function () {
  var select = document.querySelectorAll('select');
  M.FormSelect.init(select, {});

  const options = {
    duration: 300,
    onShow: null,
    swipeable: true,
    responsiveThreshold: Infinity
  };

  const tabsContainer = document.querySelector("#tabs-swipe-demo");
  M.Tabs.init(tabsContainer, options);

  var modal = document.querySelectorAll('.modal');
  M.Modal.init(modal);
});

// Display Years
var year_id = document.getElementById('select_id_year');
year_Fragment = document.createDocumentFragment();
let chosen_year = '';

let years = new Array(3);
let current_year = new Date().getFullYear();

for (i = 0; i <= 3; i++) {
  years[i] = current_year + i;
}

for (var i = 0; i <= years.length - 1; i++) {
  var option = document.createElement('option');
  option.value = years[i];
  option.appendChild(document.createTextNode(years[i]));
  year_Fragment.appendChild(option);
}
year_id.appendChild(year_Fragment);

// Grabs the year value
year_id.addEventListener('change', function () {
  chosen_year = this.value;
});

// Display Months
var month_id = document.getElementById('select_id_month');
month_Fragment = document.createDocumentFragment();
let chosen_month = '';

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

for (var i = 0; i <= months.length - 1; i++) {
  var option = document.createElement('option');
  option.value = months[i];
  option.appendChild(document.createTextNode(months[i]));
  month_Fragment.appendChild(option);
}
month_id.appendChild(month_Fragment);

// Grabs the Month value
month_id.addEventListener('change', function () {
  chosen_month = this.value;
});


// Display Weeks
var week_id = document.getElementById('select_id_week');
week_fragment = document.createDocumentFragment();
let chosen_week = '';

var weeks = ["Week1", "Week2", "Week3", "Week4"];

for (var i = 0; i <= weeks.length - 1; i++) {
  var option = document.createElement('option');
  option.value = weeks[i];
  option.appendChild(document.createTextNode(weeks[i]));
  week_fragment.appendChild(option);
}
week_id.appendChild(week_fragment);

// Grabs the Week value
week_id.addEventListener('change', function () {
  chosen_week = this.value;
});

// Display Types
var type_id = document.getElementById('select_id_type');
type_fragment = document.createDocumentFragment();
let chosen_type = '';

var types = ["Health", "Career", "Personal", "Financial", "Other"];

for (var i = 0; i <= types.length - 1; i++) {
  var option = document.createElement('option');
  option.value = types[i];
  option.appendChild(document.createTextNode(types[i]));
  type_fragment.appendChild(option);
}
type_id.appendChild(type_fragment);


// Grabs the Type value
type_id.addEventListener('change', function () {
  chosen_type = this.value;
});


// Add todo list data
const form = document.querySelector('#todo-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('users').doc(chosen_user.value)
    .collection('Goals').doc('Year')
    .collection(chosen_year).doc('Month')
    .collection(chosen_month).doc('Week')
    .collection(chosen_week).doc('Type')
    .collection(chosen_type).add({
      todo: form.todo.value,
      range: 0
    });
  form.todo.value = '';
});

//Confirm messsage
var Confirmyear = document.getElementById("select_id_year");
var Confirmmonth = document.getElementById("select_id_month");
var Confirmweek = document.getElementById("select_id_week");
var Confirmtype = document.getElementById("select_id_type");
var Confirmtodo = document.getElementById("todo");

function goalconfirm() {
  document.getElementById("goal-confirm").innerHTML =
    chosen_user.value + " " +
    Confirmyear.value + " " +
    Confirmmonth.value + " " +
    Confirmweek.value + " " +
    Confirmtype.value;
  document.getElementById("goal-confirm-text").innerHTML = Confirmtodo.value;
}

// get userlist
db.collection("users").get().then(snapshot => {
  snapshot.forEach(doc => {
    const user_tab = document.querySelector('#select_id_user');
    const html = `
    <option value="${doc.id}">${doc.data().displayName}</option>
  `;
    user_tab.innerHTML += html;

  });
});

 var chosen_user = document.getElementById("userlist");