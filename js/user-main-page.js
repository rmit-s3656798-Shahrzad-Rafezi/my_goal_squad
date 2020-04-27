// Display Years
var year_id = document.getElementById('select_id_year');
year_Fragment = document.createDocumentFragment();
let chosen_year = '';

let years = new Array(3);
let current_year = new Date().getFullYear();

for (i = 0; i <= 3; i++){
  years[i] = current_year + i;
}

for (var i = 0; i <= years.length-1; i++) {
  var option = document.createElement('option');
  option.value = years[i];
  option.appendChild(document.createTextNode(years[i]));
  year_Fragment.appendChild(option);
}
year_id.appendChild(year_Fragment);

// Grabs the year value
year_id.addEventListener('change', function() {
  chosen_year = this.value;
  //console.log(chosen_year);
});

// Display Months
var month_id = document.getElementById('select_id_month');
month_Fragment = document.createDocumentFragment();
let chosen_month = '';

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

for (var i = 0; i <= months.length-1; i++) {
  var option = document.createElement('option');
  option.value = months[i];
  option.appendChild(document.createTextNode(months[i]));
  month_Fragment.appendChild(option);
}
month_id.appendChild(month_Fragment);

// Grabs the Month value
month_id.addEventListener('change', function() {
  chosen_month = this.value;
  //console.log(chosen_month);
});

// Display Weeks
var week_id = document.getElementById('select_id_week');
week_fragment = document.createDocumentFragment();
let chosen_week = '';

var weeks = ["Week1", "Week2", "Week3", "Week4"];

for (var i = 0; i <= weeks.length-1; i++) {
  var option = document.createElement('option');
  option.value = weeks[i];
  option.appendChild(document.createTextNode(weeks[i]));
  week_fragment.appendChild(option);
}
week_id.appendChild(week_fragment);

// Grabs the Week value
week_id.addEventListener('change', function() {
  chosen_week = this.value;
  //console.log(chosen_week);
});

// Display Types
var type_id = document.getElementById('select_id_type');
type_fragment = document.createDocumentFragment();
let chosen_type = '';

var types = ["Health", "Work", "Personal"];

for (var i = 0; i <= types.length-1; i++) {
  var option = document.createElement('option');
  option.value = types[i];
  option.appendChild(document.createTextNode(types[i]));
  type_fragment.appendChild(option);
}
type_id.appendChild(type_fragment);

// Grabs the Type value
type_id.addEventListener('change', function() {
    chosen_type = this.value;
    //console.log(chosen_type);
});

// Get data in real-time
function display(userID, year, month, week, type){
  db.collection('users').doc(userID)
  .collection('Goals').doc('Year')
  .collection(year).doc('Month')
  .collection(month).doc('Week')
  .collection(week).doc('Type')
  .collection(type).onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
      if(change.type === 'added'){
        renderList(change.doc.data(), change.doc.id);
      }
      else if(change.type === 'removed'){
        removeList(change.doc.id);
      }
    });
  });
}

// This is for selection element in HTML file (CSS Materialize)
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, {});
});

// Enable offline data
db.enablePersistence().catch(function(err) {
  if (err.code == 'failed-precondition') {
    // probably multiple tabs open at once
    console.log('persistance failed');
    } 
    else if (err.code == 'unimplemented') {
      // lack of browser support for the feature
      console.log('persistance not available');
    }
 });

// Render todo list data
const todo_list = document.querySelector('.todo-lists'); 
const renderList = (data, id) => {

  const html = `
  <div class="card-panel todo white row" data-id="${id}">
      <div class="todo-details">
        <div>${data.todo}</div>
      </div>
      <div class="todo-delete">
        <i class="material-icons" data-id="${id}">delete_outline</i>
      </div>
  </div>
  `;
  
  todo_list.innerHTML += html;
};

// Remove list from DOM
const removeList = (id) => {
  const todo = document.querySelector(`.todo[data-id=${id}]`);
  todo.remove();
};

// Checks to see if that user has logged in
auth.onAuthStateChanged((user) => {

  if (user) {

    console.log(user.email, "has logged in");

    //TODO: Be able to display goals dynamically
    for(var i = 0; i <= months.length-1; i++){

      display(user.uid, current_year.toString(), months[i], 'Week1', 'Personal');
      display(user.uid, current_year.toString(), months[i], 'Week2', 'Personal');
      display(user.uid, current_year.toString(), months[i], 'Week3', 'Personal');
      display(user.uid, current_year.toString(), months[i], 'Week4', 'Personal');

      display(user.uid, current_year.toString(), months[i], 'Week1', 'Work');
      display(user.uid, current_year.toString(), months[i], 'Week2', 'Work');
      display(user.uid, current_year.toString(), months[i], 'Week3', 'Work');
      display(user.uid, current_year.toString(), months[i], 'Week4', 'Work');

      display(user.uid, current_year.toString(), months[i], 'Week1', 'Health');
      display(user.uid, current_year.toString(), months[i], 'Week2', 'Health');
      display(user.uid, current_year.toString(), months[i], 'Week3', 'Health');
      display(user.uid, current_year.toString(), months[i], 'Week4', 'Health');
    }
           
    // display(user.uid, '2020', 'January', 'Week1', 'Personal');
    // display(user.uid, '2020', 'February', 'Week1', 'Personal');
    // display(user.uid, '2020', 'March', 'Week1', 'Personal');
    // display(user.uid, '2020', 'April', 'Week1', 'Personal');
    // display(user.uid, '2020', 'May', 'Week1', 'Personal');
    // display(user.uid, '2020', 'June', 'Week1', 'Personal');
    // display(user.uid, '2020', 'July', 'Week1', 'Personal');
    // display(user.uid, '2020', 'August', 'Week1', 'Personal');
    // display(user.uid, '2020', 'September', 'Week1', 'Personal');
    // display(user.uid, '2020', 'October', 'Week1', 'Personal');
    // display(user.uid, '2020', 'November', 'Week1', 'Personal');
    // display(user.uid, '2020', 'December', 'Week1', 'Personal');

    // display(user.uid, '2020', 'January', 'Week2', 'Personal');
    // display(user.uid, '2020', 'February', 'Week2', 'Personal');
    // display(user.uid, '2020', 'March', 'Week2', 'Personal');
    // display(user.uid, '2020', 'April', 'Week2', 'Personal');
    // display(user.uid, '2020', 'May', 'Week2', 'Personal');
    // display(user.uid, '2020', 'June', 'Week2', 'Personal');
    // display(user.uid, '2020', 'July', 'Week2', 'Personal');
    // display(user.uid, '2020', 'August', 'Week2', 'Personal');
    // display(user.uid, '2020', 'September', 'Week2', 'Personal');
    // display(user.uid, '2020', 'October', 'Week2', 'Personal');
    // display(user.uid, '2020', 'November', 'Week2', 'Personal');
    // display(user.uid, '2020', 'December', 'Week2', 'Personal');

    // display(user.uid, '2020', 'January', 'Week3', 'Personal');
    // display(user.uid, '2020', 'February', 'Week3', 'Personal');
    // display(user.uid, '2020', 'March', 'Week3', 'Personal');
    // display(user.uid, '2020', 'April', 'Week3', 'Personal');
    // display(user.uid, '2020', 'May', 'Week3', 'Personal');
    // display(user.uid, '2020', 'June', 'Week3', 'Personal');
    // display(user.uid, '2020', 'July', 'Week3', 'Personal');
    // display(user.uid, '2020', 'August', 'Week3', 'Personal');
    // display(user.uid, '2020', 'September', 'Week3', 'Personal');
    // display(user.uid, '2020', 'October', 'Week3', 'Personal');
    // display(user.uid, '2020', 'November', 'Week3', 'Personal');
    // display(user.uid, '2020', 'December', 'Week3', 'Personal');

    // display(user.uid, '2020', 'January', 'Week4', 'Personal');
    // display(user.uid, '2020', 'February', 'Week4', 'Personal');
    // display(user.uid, '2020', 'March', 'Week4', 'Personal');
    // display(user.uid, '2020', 'April', 'Week4', 'Personal');
    // display(user.uid, '2020', 'May', 'Week4', 'Personal');
    // display(user.uid, '2020', 'June', 'Week4', 'Personal');
    // display(user.uid, '2020', 'July', 'Week4', 'Personal');
    // display(user.uid, '2020', 'August', 'Week4', 'Personal');
    // display(user.uid, '2020', 'September', 'Week4', 'Personal');
    // display(user.uid, '2020', 'October', 'Week4', 'Personal');
    // display(user.uid, '2020', 'November', 'Week4', 'Personal');
    // display(user.uid, '2020', 'December', 'Week4', 'Personal');

    // display(user.uid, '2020', 'January', 'Week1', 'Work');
    // display(user.uid, '2020', 'February', 'Week1', 'Work');
    // display(user.uid, '2020', 'March', 'Week1', 'Work');
    // display(user.uid, '2020', 'April', 'Week1', 'Work');
    // display(user.uid, '2020', 'May', 'Week1', 'Work');
    // display(user.uid, '2020', 'June', 'Week1', 'Work');
    // display(user.uid, '2020', 'July', 'Week1', 'Work');
    // display(user.uid, '2020', 'August', 'Week1', 'Work');
    // display(user.uid, '2020', 'September', 'Week1', 'Work');
    // display(user.uid, '2020', 'October', 'Week1', 'Work');
    // display(user.uid, '2020', 'November', 'Week1', 'Work');
    // display(user.uid, '2020', 'December', 'Week1', 'Work');

    // display(user.uid, '2020', 'January', 'Week2', 'Work');
    // display(user.uid, '2020', 'February', 'Week2', 'Work');
    // display(user.uid, '2020', 'March', 'Week2', 'Work');
    // display(user.uid, '2020', 'April', 'Week2', 'Work');
    // display(user.uid, '2020', 'May', 'Week2', 'Work');
    // display(user.uid, '2020', 'June', 'Week2', 'Work');
    // display(user.uid, '2020', 'July', 'Week2', 'Work');
    // display(user.uid, '2020', 'August', 'Week2', 'Work');
    // display(user.uid, '2020', 'September', 'Week2', 'Work');
    // display(user.uid, '2020', 'October', 'Week2', 'Work');
    // display(user.uid, '2020', 'November', 'Week2', 'Work');
    // display(user.uid, '2020', 'December', 'Week2', 'Work');

    // display(user.uid, '2020', 'January', 'Week3', 'Work');
    // display(user.uid, '2020', 'February', 'Week3', 'Work');
    // display(user.uid, '2020', 'March', 'Week3', 'Work');
    // display(user.uid, '2020', 'April', 'Week3', 'Work');
    // display(user.uid, '2020', 'May', 'Week3', 'Work');
    // display(user.uid, '2020', 'June', 'Week3', 'Work');
    // display(user.uid, '2020', 'July', 'Week3', 'Work');
    // display(user.uid, '2020', 'August', 'Week3', 'Work');
    // display(user.uid, '2020', 'September', 'Week3', 'Work');
    // display(user.uid, '2020', 'October', 'Week3', 'Work');
    // display(user.uid, '2020', 'November', 'Week3', 'Work');
    // display(user.uid, '2020', 'December', 'Week3', 'Work');

    // display(user.uid, '2020', 'January', 'Week4', 'Work');
    // display(user.uid, '2020', 'February', 'Week4', 'Work');
    // display(user.uid, '2020', 'March', 'Week4', 'Work');
    // display(user.uid, '2020', 'April', 'Week4', 'Work');
    // display(user.uid, '2020', 'May', 'Week4', 'Work');
    // display(user.uid, '2020', 'June', 'Week4', 'Work');
    // display(user.uid, '2020', 'July', 'Week4', 'Work');
    // display(user.uid, '2020', 'August', 'Week4', 'Work');
    // display(user.uid, '2020', 'September', 'Week4', 'Work');
    // display(user.uid, '2020', 'October', 'Week4', 'Work');
    // display(user.uid, '2020', 'November', 'Week4', 'Work');
    // display(user.uid, '2020', 'December', 'Week4', 'Work');

    // Add todo list data
    const form = document.querySelector('#todo-form');
    form.addEventListener('submit', (e) =>{

      e.preventDefault();

      db.collection('users').doc(user.uid)
      .collection('Goals').doc('Year')
      .collection(chosen_year).doc('Month')
      .collection(chosen_month).doc('Week')
      .collection(chosen_week).doc('Type')
      .collection(chosen_type).add({
        todo: form.todo.value
      });

      form.todo.value = '';
    });

    // Delete todo list data
    const todoContainer = document.querySelector('.todo-lists'); 
    todoContainer.addEventListener('click', e =>{
      if(e.target.tagName === 'I'){

        const id = e.target.getAttribute('data-id');

        //TODO: Be able to delete goals dynamically
        for(var i = 0; i <= months.length-1; i++){
          db.collection('users').doc(user.uid)
          .collection('Goals').doc('Year')
          .collection(current_year.toString()).doc('Month')
          .collection(months[i]).doc('Week')
          .collection('Week1').doc('Type')
          .collection('Personal').doc(id).delete();

          db.collection('users').doc(user.uid)
          .collection('Goals').doc('Year')
          .collection(current_year.toString()).doc('Month')
          .collection(months[i]).doc('Week')
          .collection('Week2').doc('Type')
          .collection('Personal').doc(id).delete();

          db.collection('users').doc(user.uid)
          .collection('Goals').doc('Year')
          .collection(current_year.toString()).doc('Month')
          .collection(months[i]).doc('Week')
          .collection('Week3').doc('Type')
          .collection('Personal').doc(id).delete();

          db.collection('users').doc(user.uid)
          .collection('Goals').doc('Year')
          .collection(current_year.toString()).doc('Month')
          .collection(months[i]).doc('Week')
          .collection('Week4').doc('Type')
          .collection('Personal').doc(id).delete();

          db.collection('users').doc(user.uid)
          .collection('Goals').doc('Year')
          .collection(current_year.toString()).doc('Month')
          .collection(months[i]).doc('Week')
          .collection('Week1').doc('Type')
          .collection('Work').doc(id).delete();

          db.collection('users').doc(user.uid)
          .collection('Goals').doc('Year')
          .collection(current_year.toString()).doc('Month')
          .collection(months[i]).doc('Week')
          .collection('Week2').doc('Type')
          .collection('Work').doc(id).delete();

          db.collection('users').doc(user.uid)
          .collection('Goals').doc('Year')
          .collection(current_year.toString()).doc('Month')
          .collection(months[i]).doc('Week')
          .collection('Week3').doc('Type')
          .collection('Work').doc(id).delete();

          db.collection('users').doc(user.uid)
          .collection('Goals').doc('Year')
          .collection(current_year.toString()).doc('Month')
          .collection(months[i]).doc('Week')
          .collection('Week3').doc('Type')
          .collection('Work').doc(id).delete();

        }
      }
    });

  } else {
    console.log("user has logged out");
    window.location.href = "../index.html";
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