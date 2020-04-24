
var y = document.getElementById('select_id_year');
let chosen_year = '';
y.addEventListener('change', function() {
  if(this.value == '2020'){
    chosen_year = this.value;
  }
  else if(this.value == '2021'){
    chosen_year = this.value;
  }
  else if(this.value == '2022'){
    chosen_year = this.value;
  }
  console.log(chosen_year);
});

var m = document.getElementById('select_id_month');
let chosen_month = '';
m.addEventListener('change', function() {
  if(this.value == 'January'){
    chosen_month = this.value;
  }
  else if(this.value == 'February'){
    chosen_month = this.value;
  }
  else if(this.value == 'March'){
    chosen_month = this.value;
  }
  console.log(chosen_month);
});

var w = document.getElementById('select_id_week');
let chosen_week = '';
w.addEventListener('change', function() {
  if(this.value == 'Week1'){
    chosen_week = this.value;
  }
  else if(this.value == 'Week2'){
    chosen_week = this.value;
  }
  else if(this.value == 'Week3'){
    chosen_week = this.value;
  }
  console.log(chosen_week);
});

var t = document.getElementById('select_id_type');
let chosen_type = '';
t.addEventListener('change', function() {
  if(this.value == 'Health'){
    chosen_type = this.value;
  }
  else if(this.value == 'Work'){
    chosen_type = this.value;
  }
  else if(this.value == 'Personal'){
    chosen_type = this.value;
  }
  console.log(chosen_type);
});

// This is for selection element in HTML file
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, {});
});

// enable offline data
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

// Delete todo list data
const todoContainer = document.querySelector('.todo-lists'); 
todoContainer.addEventListener('click', e =>{
  if(e.target.tagName === 'I'){
    const id = e.target.getAttribute('data-id');
    type.doc(id).delete();
  }
});

// Remove list from DOM
const removeList = (id) => {
  const todo = document.querySelector(`.todo[data-id=${id}]`);
  todo.remove();
};

// Checks to see if that user has logged in
auth.onAuthStateChanged((user) => {

  if (user) {

    console.log(user.email, "has logged in");
    
    // Get data in real-time
    db.collection('users').doc(user.uid)
    .collection('Goals').doc('Year')
    .collection('2020').doc('Month')
    .collection('January').doc('Week')
    .collection('Week1').doc('Type')
    .collection('Personal').onSnapshot(snapshot =>{
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

    db.collection('users').doc(user.uid)
    .collection('Goals').doc('Year')
    .collection('2020').doc('Month')
    .collection('February').doc('Week')
    .collection('Week1').doc('Type')
    .collection('Personal').onSnapshot(snapshot =>{
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