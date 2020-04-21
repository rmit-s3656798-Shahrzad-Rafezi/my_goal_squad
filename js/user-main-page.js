const todo_list = document.querySelector('#todo-list'); 
const form = document.querySelector('#add-todo-form');
let type = '';

//create element and render
function renderList(doc){
  let li = document.createElement('li');
  let todo = document.createElement('span');
  let cross = document.createElement('div');

  li.setAttribute('data-id', doc.id);
  todo.textContent = doc.data().todo;
  cross.textContent = 'x';

  li.appendChild(todo);
  li.appendChild(cross);

  todo_list.appendChild(li);

  // deleting data
  cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    type.doc(id).delete();
  });
}

//checks to see if that user has logged in
auth.onAuthStateChanged((user) => {
  if (user) {

    console.log(user.email, "has logged in");
    
    var user = db.collection('users').doc(user.uid);
    let goals = user.collection('Goals').doc('Year');
    let year = goals.collection('2020').doc('Month');
    let month = year.collection('January').doc('Week');
    let week = month.collection('Week1').doc('Type');
    type = week.collection("Personal");

    //get data
    type.get().then((snapshot) =>{
      snapshot.docs.forEach(doc =>{
        renderList(doc);
        console.log(doc.data());
      });
    });

    //add data
    form.addEventListener('submit', (e) =>{
      e.preventDefault();
      type.add({
        todo: form.todo.value
      });
      form.todo.value = '';
    });

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
