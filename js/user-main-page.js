// This is for selection, tabs element in HTML file (CSS Materialize)
document.addEventListener('DOMContentLoaded', function() {
  var select = document.querySelectorAll('select');
  var instances = M.FormSelect.init(select, {});

  const options = {
    duration: 300,
    onShow: null,
    swipeable: true,
    responsiveThreshold: Infinity
  };

  const tabsContainer = document.querySelector(".tabs");
  M.Tabs.init(tabsContainer, options);
});


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

var types = ["Health", "Career", "Personal", "Financial", "Other"];

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

// Delete todo list data
function delete_todo_list(userID, year, month, week, type, docID){
  db.collection('users').doc(userID)
  .collection('Goals').doc('Year')
  .collection(year).doc('Month')
  .collection(month).doc('Week')
  .collection(week).doc('Type')
  .collection(type).doc(docID).delete();
}

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

    // Display Goals Dynamically
    for(var i = 0; i <= months.length-1; i++){
      for(var j=0; j <= weeks.length-1; j++){
        for(var k =0; k <= types.length-1; k++){
          display(user.uid, current_year.toString(), months[i], weeks[j], types[k]);
        }
      }
    }

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

        // Delete goals dynamically
        for(var i = 0; i <= months.length-1; i++){
          for(var j=0; j <= weeks.length-1; j++){
            for(var k =0; k <= types.length-1; k++){
              delete_todo_list(user.uid, current_year.toString(), months[i], weeks[j], types[k], id);
            }
          }
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