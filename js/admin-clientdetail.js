var select_year = null;
var select_month = null;
var select_week = null;
var select_type = null;
var get_id = null;

// listen for auth changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user.email, "has logged in");
  } else {
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

// Modal Triggers
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

// Random Number Generator
function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min))
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
  console.log(chosen_week);
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
      year: chosen_year,
      month: chosen_month,
      week: chosen_week,
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

// Get data in real-time
function display(clientid, year, month, week, type) {

  const removeList = (id) => {
    const todo = document.querySelector(`.todo[data-id="${id}"]`);
    todo.remove();
  };

  if (type == "Health") {
    db.collection('users').doc(clientid)
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
          // Update range and then render
          else if (change.type === 'modified') {
            renderRange(change.doc.data(), change.doc.id);
            render_new_goal(change.doc.data(), change.doc.id);
          }
          else if (change.type === 'removed') {
            removeList(change.doc.id);
          }
        });
      });
  }

  if (type == "Career") {
    db.collection('users').doc(clientid)
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
          // Update range and then render
          else if (change.type === 'modified') {
            renderRange(change.doc.data(), change.doc.id);
            render_new_goal(change.doc.data(), change.doc.id);
          }
          else if (change.type === 'removed') {
            removeList(change.doc.id);
          }
        });
      });
  }

  if (type == "Personal") {
    db.collection('users').doc(clientid)
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
          // Update range and then render
          else if (change.type === 'modified') {
            renderRange(change.doc.data(), change.doc.id);
            render_new_goal(change.doc.data(), change.doc.id);
          }
          else if (change.type === 'removed') {
            removeList(change.doc.id);
          }
        });
      });
  }

  if (type == "Financial") {
    db.collection('users').doc(clientid)
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
          // Update range and then render
          else if (change.type === 'modified') {
            renderRange(change.doc.data(), change.doc.id);
            render_new_goal(change.doc.data(), change.doc.id);
          }
          else if (change.type === 'removed') {
            removeList(change.doc.id);
          }
        });
      });
  }

  if (type == "Other") {
    db.collection('users').doc(clientid)
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
          // Update range and then render
          else if (change.type === 'modified') {
            renderRange(change.doc.data(), change.doc.id);
            render_new_goal(change.doc.data(), change.doc.id);
          }
          else if (change.type === 'removed') {
            removeList(change.doc.id);
          }
        });
      });
  }
}
const health_tab = document.querySelector('#test-swipe-1');
const renderHealth = (data, id) => {
  const html = `
    <div id="change_colour" class="card-panel todo row" data-id="${id}">
        <div class="todo-details">
          <a data-id="${id}" data-target="modal1" class="modal-trigger">${data.todo}</a>
          <p class="update_range" data-id="${id}">${data.range}</p>        
        </div>
        <div class="todo-delete">
          <i class="material-icons" data-id="${id}">delete_outline</i>
        </div>
    </div>
    `;
  health_tab.innerHTML += html;
  //Show red, orange and green based on the range
  changeColour(data.range, id);
};

const career_tab = document.querySelector('#test-swipe-2');
const renderCareer = (data, id) => {
  const html = `
    <div id="change_colour" class="card-panel todo row" data-id="${id}">
        <div class="todo-details">
          <a data-id="${id}" data-target="modal1" class="modal-trigger">${data.todo}</a>
          <p class="update_range" data-id="${id}">${data.range}</p>        
        </div>
        <div class="todo-delete">
          <i class="material-icons" data-id="${id}">delete_outline</i>
        </div>
    </div>
    `;
  career_tab.innerHTML += html;
  //Show red, orange and green based on the range
  changeColour(data.range, id);
};

const personal_tab = document.querySelector('#test-swipe-3');
const renderPersonal = (data, id) => {
  const html = `
    <div id="change_colour" class="card-panel todo row" data-id="${id}">
        <div class="todo-details">
          <a data-id="${id}" data-target="modal1" class="modal-trigger">${data.todo}</a>
          <p class="update_range" data-id="${id}">${data.range}</p>        
        </div>
        <div class="todo-delete">
          <i class="material-icons" data-id="${id}">delete_outline</i>
        </div>
    </div>
    `;
  personal_tab.innerHTML += html;
  //Show red, orange and green based on the range
  changeColour(data.range, id);
};

const financial_tab = document.querySelector('#test-swipe-4');
const renderFinancial = (data, id) => {
  const html = `
    <div id="change_colour" class="card-panel todo row" data-id="${id}">
        <div class="todo-details">
          <a data-id="${id}" data-target="modal1" class="modal-trigger">${data.todo}</a>
          <p class="update_range" data-id="${id}">${data.range}</p>        
        </div>
        <div class="todo-delete">
          <i class="material-icons" data-id="${id}">delete_outline</i>
        </div>
    </div>
    `;
  financial_tab.innerHTML += html;
  //Show red, orange and green based on the range
  changeColour(data.range, id);
};

const other_tab = document.querySelector('#test-swipe-5');
const renderOther = (data, id) => {
  const html = `
    <div id="change_colour" class="card-panel todo row" data-id="${id}">
        <div class="todo-details">
          <a data-id="${id}" data-target="modal1" class="modal-trigger">${data.todo}</a>
          <p class="update_range" data-id="${id}">${data.range}</p>        
        </div>
        <div class="todo-delete">
          <i class="material-icons" data-id="${id}">delete_outline</i>
        </div>
    </div>
    `;
  other_tab.innerHTML += html;
  //Show red, orange and green based on the range
  changeColour(data.range, id);
};

const renderRange = (data, id) => {
  document.querySelector(`.update_range[data-id="${id}"]`).innerHTML = `<p class="update_range" data-id="${id}">${data.range}</p>`;
};

const render_new_goal = (data, id) => {
  document.querySelector(`a[data-id="${id}"]`).innerHTML = `<a data-id="${id}" data-target="modal1" class="modal-trigger">${data.todo}</a>`;
  $('a[data-id="' + id + '"]').addClass('whiteText');
};

// This is for closing the modal after submitted
modal = document.querySelector("#modal1");

const update_goal_form = document.querySelector('#update-goal-form');
function update_goal(clientid, year, month, week, type, docID, todo) {
  db.collection('users').doc(clientid)
    .collection('Goals').doc('Year')
    .collection(year).doc('Month')
    .collection(month).doc('Week')
    .collection(week).doc('Type')
    .collection(type).doc(docID).update({
      todo: todo
    });
  update_goal_form.update_goal.value = '';
}

update_goal_form.addEventListener('submit', (e) => {
  e.preventDefault();
  update_goal(chosen_client, select_year, select_month, select_week, select_type, get_id, update_goal_form.update_goal.value);
  M.Modal.getInstance(modal).close();
});

function update_range(clientid, year, month, week, type, docID, range) {
  db.collection('users').doc(clientid)
    .collection('Goals').doc('Year')
    .collection(year).doc('Month')
    .collection(month).doc('Week')
    .collection(week).doc('Type')
    .collection(type).doc(docID).update({
      range: range
    });
}

const submit_range = document.querySelector('#range-form');
submit_range.addEventListener('submit', (e) => {
  e.preventDefault();
  update_range(chosen_client, select_year, select_month, select_week, select_type, get_id, submit_range.range.value);
  //Show red, orange and green based on the submitted range
  changeColour(submit_range.range.value, get_id);

  M.Modal.getInstance(modal).close();
});

function changeColour(range_value, id_value) {
  var change_colours = ["showRed", "showOrange", "showYellow", "showGreen"];

  if (range_value < 25) {
    //Show red
    for (var i = 0; i <= change_colours.length; i++) {
      $('#change_colour[data-id="' + id_value + '"]').removeClass(change_colours[i]);
      $('#change_colour[data-id="' + id_value + '"]').addClass('showRed');
      $('a[data-id="' + id_value + '"]').addClass('whiteText');
    }
  }

  if (range_value > 25) {
    //show orange
    for (var i = 0; i <= change_colours.length; i++) {
      $('#change_colour[data-id="' + id_value + '"]').removeClass(change_colours[i]);
      $('#change_colour[data-id="' + id_value + '"]').addClass('showOrange');
      $('a[data-id="' + id_value + '"]').addClass('whiteText');
    }
  }

  if (range_value > 95) {
    //show green
    for (var i = 0; i <= change_colours.length; i++) {
      $('#change_colour[data-id="' + id_value + '"]').removeClass(change_colours[i]);
      $('#change_colour[data-id="' + id_value + '"]').addClass('showGreen');
      $('a[data-id="' + id_value + '"]').addClass('whiteText');
    }
  }

}

// Update range from Health tab
health_tab.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    const id = e.target.getAttribute('data-id');
    get_id = id;
    select_type = "Health";
  }
});

//Update range from Career tab
career_tab.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    const id = e.target.getAttribute('data-id');
    get_id = id;
    select_type = "Career";
  }
});

//Update range from Personal tab
personal_tab.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    const id = e.target.getAttribute('data-id');
    get_id = id;
    select_type = "Personal";
  }
});

//Update range from Financial tab
financial_tab.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    const id = e.target.getAttribute('data-id');
    get_id = id;
    select_type = "Financial";
  }
});

//Update range from Other tab
other_tab.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    const id = e.target.getAttribute('data-id');
    get_id = id;
    select_type = "Other";
  }
});

const healthContainer = document.querySelector('#test-swipe-1');
healthContainer.addEventListener('click', e => {
  if (e.target.tagName === 'I') {
    const id = e.target.getAttribute('data-id');
    delete_todo_list(chosen_client, select_year, select_month, select_week, "Health", id);
  }
});

const careerContainer = document.querySelector('#test-swipe-2');
careerContainer.addEventListener('click', e => {
  if (e.target.tagName === 'I') {
    const id = e.target.getAttribute('data-id');
    delete_todo_list(chosen_client, select_year, select_month, select_week, "Career", id);
  }
});

const personalContainer = document.querySelector('#test-swipe-3');
personalContainer.addEventListener('click', e => {
  if (e.target.tagName === 'I') {
    const id = e.target.getAttribute('data-id');
    delete_todo_list(chosen_client, select_year, select_month, select_week, "Personal", id);
  }
});

const financialContainer = document.querySelector('#test-swipe-4');
financialContainer.addEventListener('click', e => {
  if (e.target.tagName === 'I') {
    const id = e.target.getAttribute('data-id');
    delete_todo_list(chosen_client, select_year, select_month, select_week, "Financial", id);
  }
});

const otherContainer = document.querySelector('#test-swipe-5');
otherContainer.addEventListener('click', e => {
  if (e.target.tagName === 'I') {
    const id = e.target.getAttribute('data-id');
    delete_todo_list(chosen_client, select_year, select_month, select_week, "Other", id);
  }
});

function delete_todo_list(chosen_client, year, month, week, type, docID) {
  db.collection('users').doc(chosen_client)
    .collection('Goals').doc('Year')
    .collection(year).doc('Month')
    .collection(month).doc('Week')
    .collection(week).doc('Type')
    .collection(type).doc(docID).delete();
}

var clientid = document.getElementById("userlist");

let chosen_client = '';

// Grabs the client value
clientid.addEventListener('change', function () {
  chosen_client = this.value;
  console.log(chosen_client);
  search_task();
  // for (var i = 0; i <= months.length - 1; i++) {
  //   for (var j = 0; j <= weeks.length - 1; j++) {
  //     for (var k = 0; k <= types.length - 1; k++) {
  //       display(chosen_client, current_year.toString(), months[i], weeks[j], types[k]);
  //     }
  //   }
  // }
});

const current_week = document.querySelector("#current_week");
const current_month = document.querySelector("#current_month");
const current_this_year = document.querySelector("#current_year");

// Display years in modal
const year_modal = document.querySelector('#modal_year');
for (var i = 0; i <= years.length - 1; i++) {
  const html = `
  <div class="card-panel year row">
    <button id="year_num" value="${years[i]}" class="btn-flat" style="margin-left: 50px;">${years[i]}</button>
  </div>
  `;
  year_modal.innerHTML += html;
}

// Select year from the modal
const year = document.querySelectorAll('#year_num');
for (var i = 0; i < year.length; i++) {
  year[i].addEventListener("click", function () {
    select_year = this.value;
    current_this_year.innerHTML = select_year;
    search_task();
    const modal = document.querySelector("#modal_year");
    M.Modal.getInstance(modal).close();
  });
}

// Display months in modal
const month_modal = document.querySelector('#modal_month');
for (var i = 0; i <= months.length - 1; i++) {
  const html = `
  <div class="card-panel month row">
    <button id="month_num" value="${months[i]}" class="btn-flat" style="margin-left: 40px;">${months[i]}</button>
  </div>
  `;
  month_modal.innerHTML += html;
}

// Select month from the modal
const month = document.querySelectorAll('#month_num');
for (var i = 0; i < month.length; i++) {
  month[i].addEventListener("click", function () {
    select_month = this.value;
    current_month.innerHTML = select_month;
    search_task();
    const modal = document.querySelector("#modal_month");
    M.Modal.getInstance(modal).close();
  });
}

// Display weeks in modal
const week_modal = document.querySelector('#modal_week');
for (var i = 0; i <= weeks.length - 1; i++) {
  const html = `
  <div class="card-panel week row">
    <button id="week_num" value="${weeks[i]}" class="btn-flat" style="margin-left: 35px;">${weeks[i]}</button>
  </div>
  `;
  week_modal.innerHTML += html;
}

// Select week from the modal
const week = document.querySelectorAll('#week_num');
for (var i = 0; i < week.length; i++) {
  week[i].addEventListener("click", function () {
    select_week = this.value;
    current_week.innerHTML = select_week;
    search_task();
    const modal = document.querySelector("#modal_week");
    M.Modal.getInstance(modal).close();
  });
}

function search_task() {

  if (select_week == null) {

    const health_tab = document.querySelector('#test-swipe-1');
    health_tab.innerHTML = "";

    const career_tab = document.querySelector('#test-swipe-2');
    career_tab.innerHTML = "";

    const personal_tab = document.querySelector('#test-swipe-3');
    personal_tab.innerHTML = "";

    const financial_tab = document.querySelector('#test-swipe-4');
    financial_tab.innerHTML = "";

    const other_tab = document.querySelector('#test-swipe-5');
    other_tab.innerHTML = "";

    select_week = 'Week1';
    current_week.innerHTML = select_week;

    if (select_month == null) {
      select_month = 'January';
      current_month.innerHTML = select_month;

      if (select_year == null) {
        select_year = current_year.toString();
        current_this_year.innerHTML = select_year;

        for (var i = 0; i <= types.length - 1; i++) {
          if(chosen_client != ''){
            display(chosen_client, select_year, select_month, select_week, types[i]);
          }
        }
      } else {
        for (var i = 0; i <= types.length - 1; i++) {
          display(chosen_client, select_year, select_month, select_week, types[i]);
        }
      }
    } else {
      if (select_year == null) {
        select_year = current_year.toString();

        for (var i = 0; i <= types.length - 1; i++) {
          display(chosen_client, select_year, select_month, select_week, types[i]);
        }
      } else {

        for (var i = 0; i <= types.length - 1; i++) {
          display(chosen_client, select_year, select_month, select_week, types[i]);
        }
      }
    }
  } else {
    const health_tab = document.querySelector('#test-swipe-1');
    health_tab.innerHTML = "";

    const career_tab = document.querySelector('#test-swipe-2');
    career_tab.innerHTML = "";

    const personal_tab = document.querySelector('#test-swipe-3');
    personal_tab.innerHTML = "";

    const financial_tab = document.querySelector('#test-swipe-4');
    financial_tab.innerHTML = "";

    const other_tab = document.querySelector('#test-swipe-5');
    other_tab.innerHTML = "";

    if (select_month == null) {
      select_month = 'January';

      if (select_year == null) {
        select_year = current_year.toString();

        for (var i = 0; i <= types.length - 1; i++) {
          display(chosen_client, select_year, select_month, select_week, types[i]);
        }
      } else {
        for (var i = 0; i <= types.length - 1; i++) {
          display(chosen_client, select_year, select_month, select_week, types[i]);
        }
      }
    } else {
      if (select_year == null) {
        select_year = current_year.toString();

        for (var i = 0; i <= types.length - 1; i++) {
          display(chosen_client, select_year, select_month, select_week, types[i]);
        }
      } else {
        for (var i = 0; i <= types.length - 1; i++) {
          display(chosen_client, select_year, select_month, select_week, types[i]);
        }
      }
    }
  }
}