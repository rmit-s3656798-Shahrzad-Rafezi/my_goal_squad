auth.onAuthStateChanged((user) => {
    if (user) {
        console.log(user.email, "has logged in");

        db.collection('users').doc(user.uid).collection('journal').orderBy("timestamp", "asc").onSnapshot(snapshot => {
            if (snapshot.size == 0) {
                document.querySelector("#no-entries").style.display = "block";
            } else {
                document.querySelector("#no-entries").style.display = "none";
            }

            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    // added
                    renderEntry(change.doc.data(), change.doc.id);
                }
                else if (change.type === 'removed') {
                    // removed
                    let removedEntry = document.querySelector("#" + change.doc.id);
                    removedEntry.remove();
                };
            })
        })


    } else {
        console.log("user has logged out");
    }
});

// floationg button

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});


// Home Button
const home = document.querySelector("#home-btn");

home.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/pages/user-main-page.html";
});

// write journal 

const journalForm = document.querySelector("#journal-form");

journalForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let user_entry = journalForm["journal-entry"].value;
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + ' ' + time;
    // let dateTime = new firebase.firestore.Timestamp.now();


    auth.onAuthStateChanged((user) => {
        db.collection('users').doc(user.uid).collection('journal').add({
            timestamp: dateTime,
            entry_string: user_entry
        }).then(() => {
            const modal = document.querySelector("#modal-entry");
            M.Modal.getInstance(modal).close();
            journalForm.reset();
        })
    });

})


// render Entry

const renderEntry = (data, id) => {
    const html = `
    <div class="card-panel teal lighten-4" id="${id}">
          <span class="black-text">
          ${data.entry_string}
          </span>
        </div>
    `;
    let entries = document.querySelector(".entry-container");
    entries.innerHTML += html;
}