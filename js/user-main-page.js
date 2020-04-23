const form = document.querySelector('#add-todo-form');
let type = '';

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
        <div class="recipe-title">${data.todo}</div>
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
    
    var user = db.collection('users').doc(user.uid);
    var goals = user.collection('Goals').doc('Year');
    var year = goals.collection('2020').doc('Month');
    var month = year.collection('January').doc('Week');
    var week = month.collection('Week1').doc('Type');
    type = week.collection("Personal");

    // Get data in real-time
    type.onSnapshot(snapshot => {

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
    form.addEventListener('submit', (e) =>{
      e.preventDefault();
      type.add({
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