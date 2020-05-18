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

  const tabsContainer = document.querySelector(".tabs");
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

// Get data in real-time based on types
function display(userID, year, month, week, type) {

  if (type == "Health") {
    db.collection('users').doc(userID)
      .collection('Goals').doc('Year')
      .collection(year).doc('Month')
      .collection(month).doc('Week')
      .collection(week).doc('Type')
      .collection(type).onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
          if (change.type === 'added') {
            renderHealth(change.doc.data(), change.doc.id);
          }
          else if (change.type === 'removed') {
            removeList(change.doc.id);
          }
        });
      });
  }

  if (type == "Career") {
    db.collection('users').doc(userID)
      .collection('Goals').doc('Year')
      .collection(year).doc('Month')
      .collection(month).doc('Week')
      .collection(week).doc('Type')
      .collection(type).onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
          if (change.type === 'added') {
            renderCareer(change.doc.data(), change.doc.id);
          }
          else if (change.type === 'removed') {
            removeList(change.doc.id);
          }
        });
      });
  }

  if (type == "Personal") {
    db.collection('users').doc(userID)
      .collection('Goals').doc('Year')
      .collection(year).doc('Month')
      .collection(month).doc('Week')
      .collection(week).doc('Type')
      .collection(type).onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
          if (change.type === 'added') {
            renderPersonal(change.doc.data(), change.doc.id);
          }
          else if (change.type === 'removed') {
            removeList(change.doc.id);
          }
        });
      });
  }

  if (type == "Financial") {
    db.collection('users').doc(userID)
      .collection('Goals').doc('Year')
      .collection(year).doc('Month')
      .collection(month).doc('Week')
      .collection(week).doc('Type')
      .collection(type).onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
          if (change.type === 'added') {
            renderFinancial(change.doc.data(), change.doc.id);
          }
          else if (change.type === 'removed') {
            removeList(change.doc.id);
          }
        });
      });
  }

  if (type == "Other") {
    db.collection('users').doc(userID)
      .collection('Goals').doc('Year')
      .collection(year).doc('Month')
      .collection(month).doc('Week')
      .collection(week).doc('Type')
      .collection(type).onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
          if (change.type === 'added') {
            renderOther(change.doc.data(), change.doc.id);
          }
          else if (change.type === 'removed') {
            removeList(change.doc.id);
          }
        });
      });
  }
}

// Delete todo list data
function delete_todo_list(userID, year, month, week, type, docID) {
  db.collection('users').doc(userID)
    .collection('Goals').doc('Year')
    .collection(year).doc('Month')
    .collection(month).doc('Week')
    .collection(week).doc('Type')
    .collection(type).doc(docID).delete();
}

// Update Range
function update_range(userID, year, month, week, type, docID) {
  const range_form = document.querySelector('#range-form');
  range_form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('users').doc(userID)
      .collection('Goals').doc('Year')
      .collection(year).doc('Month')
      .collection(month).doc('Week')
      .collection(week).doc('Type')
      .collection(type).doc(docID).update({ 
        range: range_form.range.value 
      });
      //TODO: Need to think of a way to keep the colors when range changes
      if(range_form.range.value < 35){
        $(".todo").css("background", "red");
      }
      else if(range_form.range.value > 25){
        $(".todo").css("background", "orange");
      }
      else if(range_form.range.value > 50){
        $(".todo").css("background", "yellow");
      }
      else if(range_form.range.value > 70){
        $(".todo").css("background", "Green");
      }
  });
}

// Enable offline data
db.enablePersistence().catch(function (err) {
  if (err.code == 'failed-precondition') {
    // probably multiple tabs open at once
    console.log('persistance failed');
  }
  else if (err.code == 'unimplemented') {
    // lack of browser support for the feature
    console.log('persistance not available');
  }
});

const health_tab = document.querySelector('#test-swipe-1');
const renderHealth = (data, id) => {
  const html = `
  <div class="card-panel todo row" data-id="${id}">
      <div class="todo-details">
        <a data-id="${id}" data-target="modal1" class="modal-trigger">${data.todo}</a>        
      </div>
      <div class="todo-delete">
        <i class="material-icons" data-id="${id}">delete_outline</i>
      </div>
  </div>
  `;
  health_tab.innerHTML += html;
};

const career_tab = document.querySelector('#test-swipe-2');
const renderCareer = (data, id) => {
  const html = `
  <div class="card-panel todo row" data-id="${id}">
      <div class="todo-details">
        <a data-id="${id}" data-target="modal1" class="modal-trigger">${data.todo}</a>
      </div>
      <div class="todo-delete">
        <i class="material-icons" data-id="${id}">delete_outline</i>
      </div>
  </div>
  `;
  career_tab.innerHTML += html;
};

const personal_tab = document.querySelector('#test-swipe-3');
const renderPersonal = (data, id) => {
  const html = `
  <div class="card-panel todo row" data-id="${id}">
      <div class="todo-details">
        <a data-id="${id}" data-target="modal1" class="modal-trigger">${data.todo}</a>
      </div>
      <div class="todo-delete">
        <i class="material-icons" data-id="${id}">delete_outline</i>
      </div>
  </div>
  `;
  personal_tab.innerHTML += html;
};

const financial_tab = document.querySelector('#test-swipe-4');
const renderFinancial = (data, id) => {
  const html = `
  <div class="card-panel todo row" data-id="${id}">
      <div class="todo-details">
        <a data-id="${id}" data-target="modal1" class="modal-trigger">${data.todo}</a>
      </div>
      <div class="todo-delete">
        <i class="material-icons" data-id="${id}">delete_outline</i>
      </div>
  </>
  `;
  financial_tab.innerHTML += html;
};

const other_tab = document.querySelector('#test-swipe-5');
const renderOther = (data, id) => {
  const html = `
  <div class="card-panel todo row" data-id="${id}">
      <div class="todo-details">
        <a data-id="${id}" data-target="modal1" class="modal-trigger">${data.todo}</a>
      </div>
      <div class="todo-delete">
        <i class="material-icons" data-id="${id}">delete_outline</i>
      </div>
  </div>
  `;
  other_tab.innerHTML += html;
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
    for (var i = 0; i <= months.length - 1; i++) {
      for (var j = 0; j <= weeks.length - 1; j++) {
        for (var k = 0; k <= types.length - 1; k++) {
          display(user.uid, current_year.toString(), months[i], weeks[j], types[k]);
        }
      }
    }

    // Add todo list data
    const form = document.querySelector('#todo-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      db.collection('users').doc(user.uid)
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

    // NOTE: 
    // Will have to do similar to the above code where you'd have to loop through months, weeks and types 
    // in order to change the range on specific list.
    //
    // Create a method called update range that takes userID, year, months, weeks and types and docID. similar to delete-list
    //
    // Be able to change the colour based on range

    //Update range from Health tab
    const health_tab = document.querySelector('#test-swipe-1');
    health_tab.addEventListener('click', e => {
      if(e.target.tagName === 'A'){
        const id = e.target.getAttribute('data-id');
        for (var i = 0; i <= months.length - 1; i++) {
          for (var j = 0; j <= weeks.length - 1; j++) {
            update_range(user.uid, current_year.toString(), months[i], weeks[j], "Health", id);
          }
        } 
      }
    });

    //Update range from Career tab
    const career_tab = document.querySelector('#test-swipe-2');
    career_tab.addEventListener('click', e => {
      if(e.target.tagName === 'A'){
        const id = e.target.getAttribute('data-id');
        for (var i = 0; i <= months.length - 1; i++) {
          for (var j = 0; j <= weeks.length - 1; j++) {
            update_range(user.uid, current_year.toString(), months[i], weeks[j], "Career", id);
          }
        } 
      }
    });

    //Update range from Personal tab
    const personal_tab = document.querySelector('#test-swipe-3');
    personal_tab.addEventListener('click', e => {
      if(e.target.tagName === 'A'){
        const id = e.target.getAttribute('data-id');
        for (var i = 0; i <= months.length - 1; i++) {
          for (var j = 0; j <= weeks.length - 1; j++) {
            update_range(user.uid, current_year.toString(), months[i], weeks[j], "Personal", id);
          }
        } 
      }
    });

    //Update range from Financial tab
    const financial_tab = document.querySelector('#test-swipe-4');
    financial_tab.addEventListener('click', e => {
      if(e.target.tagName === 'A'){
        const id = e.target.getAttribute('data-id');
        for (var i = 0; i <= months.length - 1; i++) {
          for (var j = 0; j <= weeks.length - 1; j++) {
            update_range(user.uid, current_year.toString(), months[i], weeks[j], "Financial", id);
          }
        } 
      }
    });

    //Update range from Other tab
    const other_tab = document.querySelector('#test-swipe-5');
    other_tab.addEventListener('click', e => {
      if(e.target.tagName === 'A'){
        const id = e.target.getAttribute('data-id');
        for (var i = 0; i <= months.length - 1; i++) {
          for (var j = 0; j <= weeks.length - 1; j++) {
            update_range(user.uid, current_year.toString(), months[i], weeks[j], "Other", id);
          }
        } 
      }
    });

    //Delete the list from Health tab
    const healthContainer = document.querySelector('#test-swipe-1');
    healthContainer.addEventListener('click', e => {
      if (e.target.tagName === 'I') {
        const id = e.target.getAttribute('data-id');
        console.log(id);
        // Delete goals dynamically
        for (var i = 0; i <= months.length - 1; i++) {
          for (var j = 0; j <= weeks.length - 1; j++) {
            delete_todo_list(user.uid, current_year.toString(), months[i], weeks[j], "Health", id);
          }
        }
      }
    });

    //Delete the list from Career tab
    const careerContainer = document.querySelector('#test-swipe-2');
    careerContainer.addEventListener('click', e => {
      if (e.target.tagName === 'I') {
        const id = e.target.getAttribute('data-id');
        // Delete goals dynamically
        for (var i = 0; i <= months.length - 1; i++) {
          for (var j = 0; j <= weeks.length - 1; j++) {
            delete_todo_list(user.uid, current_year.toString(), months[i], weeks[j], "Career", id);
          }
        }
      }
    });

    //Delete the list from Personal tab
    const personalContainer = document.querySelector('#test-swipe-3');
    personalContainer.addEventListener('click', e => {
      if (e.target.tagName === 'I') {
        const id = e.target.getAttribute('data-id');
        // Delete goals dynamically
        for (var i = 0; i <= months.length - 1; i++) {
          for (var j = 0; j <= weeks.length - 1; j++) {
            delete_todo_list(user.uid, current_year.toString(), months[i], weeks[j], "Personal", id);
          }
        }
      }
    });

    //Delete the list from Financial tab
    const financialContainer = document.querySelector('#test-swipe-4');
    financialContainer.addEventListener('click', e => {
      if (e.target.tagName === 'I') {
        const id = e.target.getAttribute('data-id');
        // Delete goals dynamically
        for (var i = 0; i <= months.length - 1; i++) {
          for (var j = 0; j <= weeks.length - 1; j++) {
            delete_todo_list(user.uid, current_year.toString(), months[i], weeks[j], "Financial", id); 
          }
        }
      }
    });

    //Delete the list from Other tab
    const otherContainer = document.querySelector('#test-swipe-5');
    otherContainer.addEventListener('click', e => {
      if (e.target.tagName === 'I') {
        const id = e.target.getAttribute('data-id');
        // Delete goals dynamically
        for (var i = 0; i <= months.length - 1; i++) {
          for (var j = 0; j <= weeks.length - 1; j++) {
            delete_todo_list(user.uid, current_year.toString(), months[i], weeks[j], "Other", id);
          }
        }
      }
    });

  } else {
    console.log("user has logged out");
    window.location.href = "../index.html";
  }
});

//Logout Button
const logout = document.querySelector("#logout-btn");

logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    window.location.href = "../index.html";
  });
});